export interface IMatchCode {
  code: string,
  new?: boolean,
  finish?: boolean
}

interface ITeam {
  name: string,
  goals: number
}

export interface INewMatch extends IMatchCode{
  homeTeam: ITeam,
  awayTeam: ITeam,
}

export interface IUpdateMatch extends IMatchCode {
  team: string,
  goals: number,
  new: boolean
}

