import { Component } from '@angular/core';
import { Dropdown, IMatchCode, INewMatch, IUpdateMatch, ScoreboardService } from 'scoreboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'acme-scoreboard';
  newMatch:INewMatch;
  updateMatch:IUpdateMatch;
  finishCode: IMatchCode;
  dropdown = Dropdown;

  constructor(private scoreboardService: ScoreboardService) {
    this.newMatch = this.resetNewMatch();
    this.updateMatch = this.resetUpdateMatch();
    this.finishCode = this.resetFinishMatch();
  }

  resetNewMatch(): INewMatch {
    return {
      code: '',
      homeTeam: {
        name: '',
        goals: 0
      },
      awayTeam: {
        name: '',
        goals: 0
      },
      new: true
    } as INewMatch;
  }

  resetUpdateMatch(): IUpdateMatch {
    return {
      code: '',
      team: '',
      goals: 0,
      new: false
    } as IUpdateMatch;
  }

  resetFinishMatch(): IMatchCode {
    return {
      finish: true,
      code: ''
    } as IMatchCode;
  }

  addMatch() {
    this.scoreboardService.next(this.newMatch);
    this.newMatch = this.resetNewMatch();
  }

  updateMatchScore() {
    this.scoreboardService.next(this.updateMatch);
  }

  finishMatch() {
    this.scoreboardService.next(this.finishCode);
    this.finishCode = this.resetFinishMatch();
    this.updateMatch = this.resetUpdateMatch();
  }
}
