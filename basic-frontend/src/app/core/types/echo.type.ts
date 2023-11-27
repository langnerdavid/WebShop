export interface CreateEchoInput {
  message: string;
}

export interface Echo {
  _id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
