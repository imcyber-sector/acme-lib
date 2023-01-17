import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMatchCode, INewMatch, IUpdateMatch } from '../public-api';
import { ScoreboardService } from './scoreboard.service';

@Component({
  selector: 'lib-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit, OnDestroy {

  data:INewMatch[] = [];
  summaryArr:INewMatch[] = [];
  sub: any;
  errorMsg: string = '';
  timeout: number = 5000;
  timer?: NodeJS.Timeout;
  constructor(private scoreboardService: ScoreboardService) { }

  ngOnInit(): void {
    this.sub = this.scoreboardService.scoresObservable$.subscribe({
      next: (score) => this.handleScore(score),
      error: err => console.log(err)
    });
  }

  handleScore(value:IMatchCode|IUpdateMatch|INewMatch) {
    if(value.finish) {
      this.finishMatch(<IMatchCode>value);
    } else if(value.new) {
      this.addMatch(<INewMatch>value);
    } else if(!value.new){
      this.updateScore(<IUpdateMatch>value);
    } else {
      this.errorMsg = `Please try again with correct data !!`;
      this.startSetTImeOut();
      return;
    }
    this.summary();
  }

  addMatch(value: INewMatch) {
    if(!!!value.code || !!!value.homeTeam.name || !!!value.awayTeam.name) {
      this.errorMsg = `Match-code and both team names are necessary to add match to scoreboard !!`;
      this.startSetTImeOut();
      return;
    }
    let index  = this.data.findIndex(e => ( e.code === value.code ||
                                          e.homeTeam.name.toLowerCase() === value.homeTeam.name.toLowerCase() ||
                                          e.homeTeam.name.toLowerCase() === value.awayTeam.name.toLowerCase() ||
                                          e.awayTeam.name.toLowerCase() === value.awayTeam.name.toLowerCase() ||
                                          e.awayTeam.name.toLowerCase() === value.homeTeam.name.toLowerCase()));
    if(index > -1) {
      this.errorMsg = `Match-code or either of the teams already exist in the scoreboard !!`;
      this.startSetTImeOut();
      return;
    }
    value.homeTeam.goals = 0;
    value.awayTeam.goals = 0;

    this.data = [...this.clone(this.data), ...this.clone([value])];
  }

  updateScore(value: IUpdateMatch) {
    if(!!!value.code) {
      this.errorMsg = `Please enter match code to be able to update match score.`;
      this.startSetTImeOut();
      return;
    }
    let index = this.data.findIndex(e => (e.code === value.code));
    if(index < 0) {
      this.errorMsg = `No match found with code ${value.code}.`;
      this.startSetTImeOut();
      return;
    }
    let ele = this.clone([this.data[index]])[0];
    ele[value.team].goals = +value.goals;
    this.data = [...this.clone(this.data.slice(0,index)), this.clone([ele])[0], ...this.clone(this.data.slice(index+1))];
  }

  finishMatch(value: IMatchCode) {
    if(!!!value.code) {
      this.errorMsg = `Please enter match code to be able to finish match.`;
      this.startSetTImeOut();
      return;
    }
    let index = this.data.findIndex(e => e.code === value.code);
    if(index < 0) {
      this.errorMsg = `No match found with code ${value.code}.`;
      this.startSetTImeOut();
      return;
    }
    this.data = [...this.clone(this.data.slice(0,index)), ...this.clone(this.data.slice(index+1))];
  }

  summary() {
    this.summaryArr = [...this.clone(this.data)];
    this.summaryArr.reverse();
    this.summaryArr.sort((a,b) => {
      return (b.homeTeam.goals+b.awayTeam.goals)-(a.homeTeam.goals+a.awayTeam.goals);
    });
  }

  startSetTImeOut() {
    this.timer = setTimeout(() => {
      this.errorMsg = '';
    }, this.timeout);
  }

  clone(value:INewMatch[]) {
    return JSON.parse(JSON.stringify(value));
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
    if(this.timer) {
      clearTimeout(this.timer);
    }
  }
}
