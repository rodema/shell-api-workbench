export type PayloadTemplate = {
    id: string,
    name: string,
    description: string,
    payload: string,
    customLoaded: boolean,
    direction: 'SENT' | 'RECEIVED'
  };

export type ExportPayloadTemplate = {
  name: string,
  description: string,
  payload: string | object,
  direction: 'SENT' | 'RECEIVED'
};
