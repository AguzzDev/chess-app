import { BoardGame, PieceTypeEnum } from "@/interfaces";

type SubscriptionType = "UpdateGame" | "Client_Crowning" | "Server_Crowning";
type SubscriptionDataMap = {
  UpdateGame: BoardGame;
  Server_Crowning: boolean;
  Client_Crowning: PieceTypeEnum;
};
type Callback<T extends SubscriptionType> = (data: SubscriptionDataMap[T]) => void;

export class SocketRepository {
  private sockets: {
    [K in SubscriptionType]: Callback<K>[];
  } = {
    UpdateGame: [],
    Client_Crowning: [],
    Server_Crowning: [],
  };

  once<T extends SubscriptionType>(type: T, callback: Callback<T>) {
    return new Promise<SubscriptionDataMap[T]>((resolve) => {
      const handler: Callback<T> = (data) => {
        callback(data);
        this.unSubscribe(type, handler);
        resolve(data);
      };

      this.subscribe(type, handler);
    });
  }

  subscribe<T extends SubscriptionType>(type: T, callback: Callback<T>) {
    this.sockets[type].push(callback);
  }

  unSubscribe<T extends SubscriptionType>(type: T, callback: Callback<T>) {
    const arr = this.sockets[type];
    const index = arr.indexOf(callback);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  publish<T extends SubscriptionType>(type: T, data: SubscriptionDataMap[T]) {
    for (const callback of this.sockets[type]) {
      callback(data);
    }
  }
}
