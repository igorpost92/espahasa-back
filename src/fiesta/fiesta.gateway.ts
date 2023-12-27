import {
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserSessionsService } from '../users/user-sessions.service';
import { WordsService } from '../words/words.service';
import { Lang } from '../models/lang.enum';
import { shuffle } from '../utils/shuffle';

interface Player {
  sessionId: string;
  username: string;
}

interface Word {
  id: string;
  type?: string;
  text: string;
  meaning: string;
  author: string;
}

interface Room {
  author: Player;
  players: Player[];
}

interface Game extends Room {
  // TODO: lang: string
  // TODO: settings

  words: Word[];

  currentWordIndex: number;
  currentWord: Word;
  stats: Record<string, number>;
  playersReady: string[];
}

interface ClientGameState extends Omit<Game, 'words'> {
  wordsCount: number;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class FiestaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userSessionsService: UserSessionsService,
    private wordsService: WordsService,
  ) {}

  @WebSocketServer()
  server!: Server;

  rooms: Room[] = [];
  games: Game[] = [];

  afterInit(server: Server) {
    server.use(async (socket, next) => {
      const sessionId = socket.handshake.auth.sessionId;

      const currentUser = (await this.userSessionsService.getSession(sessionId))
        ?.user;

      if (!currentUser) {
        // TODO:
        console.error('invalid user');
        return next(new Error('invalid user'));
      }

      // TODO: del
      (socket as any).username = currentUser.name;

      const currentPlayer: Player = {
        sessionId,
        username: currentUser.name,
      };

      (socket as any).currentPlayer = currentPlayer;
      next();
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const { currentPlayer } = client as any;
    console.log(`Connected`, currentPlayer.username, client.id);

    client.emit('rooms', this.rooms);

    // client.broadcast.emit('user connected', {
    //   userID: client.id,
    //   username,
    // });
  }

  handleDisconnect(client: Socket) {
    const { currentPlayer } = client as any;
    console.log(`Disconnected`, currentPlayer.username, client.id);
  }

  notifyAboutGame(game: Game) {
    const { words, ...restData } = game;

    const state: ClientGameState = {
      ...restData,
      wordsCount: words.length,
    };

    for (const [id, socket] of this.server.of('/').sockets) {
      if (
        game.players.find(
          (player) => player.username === (socket as any).username,
        )
      ) {
        socket.emit('game-info', state);
      }
    }
  }

  @SubscribeMessage('create-room')
  async createRoom(@ConnectedSocket() client: Socket): Promise<void> {
    const { currentPlayer } = client as any;
    console.log('create-room', currentPlayer.username);

    const alreadyExists = this.rooms.some(
      (room) => room.author.username === currentPlayer.username,
    );

    if (alreadyExists) {
      return;
    }

    this.rooms.push({
      author: currentPlayer,
      players: [currentPlayer],
    });

    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { author: string },
  ): Promise<void> {
    const { currentPlayer } = client as any;

    console.log('join-room', data, currentPlayer.username);

    const room = this.rooms.find(
      (item) => item.author.username === data.author,
    );

    if (!room) {
      return;
    }

    if (room.players.includes(currentPlayer)) {
      return;
    }

    room.players.push(currentPlayer);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { author: string },
  ): Promise<void> {
    const { currentPlayer } = client as any;

    console.log('leave-room', data, currentPlayer.username);

    const room = this.rooms.find(
      (room) => room.author.username === data.author,
    );

    if (!room) {
      return;
    }

    const isOwnRoom = room.author.username === currentPlayer.username;
    if (isOwnRoom) {
      this.rooms = this.rooms.filter((item) => item !== room);
    } else {
      room.players = room.players.filter((player) => player !== currentPlayer);
    }

    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('start-game')
  async startGame(@ConnectedSocket() client: Socket): Promise<void> {
    const { currentPlayer } = client as any;

    console.log('start-game', currentPlayer.username);

    const currentRoom = this.rooms.find(
      (room) => room.author.username === currentPlayer.username,
    );

    if (!currentRoom) {
      // TODO:
      return;
    }

    this.rooms = this.rooms.filter((room) => room !== currentRoom);

    const words = (
      await Promise.all(
        currentRoom.players.map(async (player) => {
          const user = (
            await this.userSessionsService.getSession(player.sessionId)
          )?.user;

          if (!user) {
            // TODO:
            return [];
          }

          const words = await this.wordsService.getAllWords(user, {
            lang: Lang.ES,
          });

          return words.map((word) => {
            const gameWord: Word = {
              id: word.id,
              type: word.type,
              text: word.text,
              meaning: word.meaning,
              author: user.name,
            };

            return gameWord;
          });
        }),
      )
    ).flat();

    const shuffledWords = shuffle(words).slice(0, 100);

    const newGame: Game = {
      ...currentRoom,
      currentWordIndex: 0,
      currentWord: shuffledWords[0],
      words: shuffledWords,
      stats: Object.fromEntries(
        currentRoom.players.map((player) => [player.username, 0]),
      ),
      playersReady: [],
    };

    this.games.push(newGame);

    this.notifyAboutGame(newGame);

    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('give-answer')
  async giveAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { answer: boolean },
  ): Promise<void> {
    const { currentPlayer } = client as any;
    console.log('give-answer', currentPlayer.username);

    // TODO:
    const game = this.games.at(-1);

    if (!game) {
      // TODO:
      return;
    }

    // TODO: duplicates
    if (game.playersReady.includes(currentPlayer.username)) {
      return;
    }

    game.playersReady.push(currentPlayer.username);
    if (data.answer) {
      game.stats[currentPlayer.username]++;
    }

    if (game.playersReady.length === game.players.length) {
      game.currentWordIndex++;
      game.currentWord = game.words[game.currentWordIndex];
      game.playersReady = [];
    }

    this.notifyAboutGame(game);
  }
}
