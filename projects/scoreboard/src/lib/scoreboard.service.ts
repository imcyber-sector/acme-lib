import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMatchCode, INewMatch, IUpdateMatch } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {
  private _score = new Subject<IMatchCode|IUpdateMatch|INewMatch>();
  scoresObservable$ = this._score.asObservable();

  constructor() { }

  next(value:IMatchCode|IUpdateMatch|INewMatch) {
    this._score.next(value);
  }
}
