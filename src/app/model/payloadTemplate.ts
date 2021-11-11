export type PayloadTemplate = {
    id: string,
    name: string,
    description: string,
    payload: string,
    customLoaded: boolean,
    direction: 'SENT' | 'RECEIVED'
  };
