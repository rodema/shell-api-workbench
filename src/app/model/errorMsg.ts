export type ErrorMsg = {
  level: MsgLevel,
  title: string,
  msg: string,
  details: string[]
};

export enum MsgLevel {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  FatalError = 'FatalError'
}
