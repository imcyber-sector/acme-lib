import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IMatchCode, INewMatch, IUpdateMatch, ScoreboardService } from 'scoreboard';

import { ScoreboardComponent } from './scoreboard.component';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;
  let service: any;

  beforeEach(async () => {
    service = jasmine.createSpyObj(['scoresObservable$'])
    await TestBed.configureTestingModule({
      declarations: [ ScoreboardComponent ],
      providers: [
        { provide: ScoreboardService, useValue: service}
      ]
    })
    .compileComponents();
  });

  // handleScore
  describe('handleScore', () => {
    let matches: INewMatch[];
    let update: IUpdateMatch;
    let finishMatch: IMatchCode;
    beforeEach(() => {
      matches = [
        { code: '1', homeTeam: { name: 'A', goals: 0}, awayTeam: { name: 'B', goals: 0 }, new: true},
        { code: '2', homeTeam: { name: 'C', goals: 0}, awayTeam: { name: 'D', goals: 0 }, new: true},
        { code: '3', homeTeam: { name: 'M', goals: 0}, awayTeam: { name: 'N', goals: 0 }, new: true},
      ];
      update = { code: '1', team: 'homeTeam', goals: 1, new: false };
      finishMatch = { code: '3', finish: true};

      fixture = TestBed.createComponent(ScoreboardComponent);
      component = fixture.componentInstance;

      service.scoresObservable$ = (of({}));
      fixture.detectChanges();
    })

    it('should accept INewMatch interface format', () => {
      component.handleScore(matches[0]);

      expect(component.data.length).toBe(1);
      expect(component.errorMsg).toBe('');
    });

    it('should accept IUpdateMatch interface format', () => {
      component.data = matches;
      component.updateScore(update);

      expect(component.data.length).toBe(3);
      expect(component.errorMsg).toBe('');
    });

    it('should accept IMatchCode interface format', () => {
      component.data = matches;
      component.handleScore(finishMatch);

      expect(component.data.length).toBe(2);
      expect(component.errorMsg).toBe('');
    })
  })

  // addMatch
  describe('addMatch', () => {
    let matches: INewMatch[];
    let update: IUpdateMatch;
    let finishMatch: IMatchCode;
    beforeEach(() => {
      matches = [
        { code: '1', homeTeam: { name: 'A', goals: 0}, awayTeam: { name: 'B', goals: 0 }, new: true},
        { code: '2', homeTeam: { name: 'C', goals: 0}, awayTeam: { name: 'D', goals: 0 }, new: true},
        { code: '3', homeTeam: { name: 'M', goals: 0}, awayTeam: { name: 'N', goals: 0 }, new: true},
      ];
      update = { code: '1', team: 'homeTeam', goals: 1, new: false };
      finishMatch = { code: '3', finish: true};

      fixture = TestBed.createComponent(ScoreboardComponent);
      component = fixture.componentInstance;
    })

    it('should not accept empty interface object', () => {
      component.addMatch({ code: '', homeTeam: { name: '', goals: 0 }, awayTeam: { name: '', goals: 0 }, new: true});

      expect(component.errorMsg).toBe('Match-code and both team names are necessary to add match to scoreboard !!');
    });

    it('should accept INewMatch interface format', () => {
      component.addMatch(matches[0]);

      expect(component.data.length).toBe(1);
      expect(component.data[0]).toEqual(matches[0]);
      expect(component.errorMsg).toBe('');
    });

    it('should not add if match code and/or either team already exist', () => {
      component.data = matches;
      component.addMatch(matches[0]);

      expect(component.data.length).toBe(3);
      expect(component.errorMsg).toBe('Match-code or either of the teams already exist in the scoreboard !!');
    });
  })

  // updateScore
  describe('updateMatch', () => {
    let matches: INewMatch[];
    let update: IUpdateMatch;
    let finishMatch: IMatchCode;
    beforeEach(() => {
      matches = [
        { code: '1', homeTeam: { name: 'A', goals: 0}, awayTeam: { name: 'B', goals: 0 }, new: true},
        { code: '2', homeTeam: { name: 'C', goals: 0}, awayTeam: { name: 'D', goals: 0 }, new: true},
        { code: '3', homeTeam: { name: 'M', goals: 0}, awayTeam: { name: 'N', goals: 0 }, new: true},
      ];
      update = { code: '1', team: 'homeTeam', goals: 1, new: false };
      finishMatch = { code: '3', finish: true};

      fixture = TestBed.createComponent(ScoreboardComponent);
      component = fixture.componentInstance;
    })

    it('should not accept empty interface object', () => {
      component.updateScore({ code: '', team: '', goals: 0, new: false});

      expect(component.errorMsg).toBe('Please enter match code to be able to update match score.');
    });

    it('should accept IUpateMatch interface format', () => {
      component.data = matches;
      component.updateScore(update);

      expect(component.data.length).toBe(3);
      expect(component.data[0].homeTeam.goals).toBe(update.goals);
      expect(component.errorMsg).toBe('');
    });

    it('should not update if there is no entry for match code', () => {
      component.data = matches.slice(1);
      component.updateScore(update);

      expect(component.data.length).toBe(2);
      expect(component.errorMsg).toBe('No match found with code 1.');
    });
  })

  // finishMatch
  describe('finishMatch', () => {
    let matches: INewMatch[];
    let update: IUpdateMatch;
    let finishMatch: IMatchCode;
    beforeEach(() => {
      matches = [
        { code: '1', homeTeam: { name: 'A', goals: 0}, awayTeam: { name: 'B', goals: 0 }, new: true},
        { code: '2', homeTeam: { name: 'C', goals: 0}, awayTeam: { name: 'D', goals: 0 }, new: true},
        { code: '3', homeTeam: { name: 'M', goals: 0}, awayTeam: { name: 'N', goals: 0 }, new: true},
      ];
      update = { code: '1', team: 'homeTeam', goals: 1, new: false };
      finishMatch = { code: '3', finish: true};

      fixture = TestBed.createComponent(ScoreboardComponent);
      component = fixture.componentInstance;
    })

    it('should not accept empty interface object', () => {
      component.finishMatch({ code: '', finish: true});

      expect(component.errorMsg).toBe('Please enter match code to be able to finish match.');
    });

    it('should accept IMatchCode interface format', () => {
      component.data = matches;
      component.finishMatch(finishMatch);

      expect(component.data.length).toBe(2);
      expect(component.data[component.data.length-1].code).toBe('2');
      expect(component.errorMsg).toBe('');
    });

    it('should not update if there is no entry for match code', () => {
      component.data = matches.slice(0, 2);
      component.finishMatch(finishMatch);

      expect(component.data.length).toBe(2);
      expect(component.errorMsg).toBe('No match found with code 3.');
    });
  })

  // summary
  describe('summary', () => {
    let matches: INewMatch[];
    let update: IUpdateMatch;
    let finishMatch: IMatchCode;
    beforeEach(() => {
      matches = [
        { code: '1', homeTeam: { name: 'A', goals: 0}, awayTeam: { name: 'B', goals: 0 }, new: true},
        { code: '2', homeTeam: { name: 'C', goals: 0}, awayTeam: { name: 'D', goals: 0 }, new: true},
        { code: '3', homeTeam: { name: 'M', goals: 0}, awayTeam: { name: 'N', goals: 0 }, new: true},
      ];
      update = { code: '1', team: 'homeTeam', goals: 1, new: false };
      finishMatch = { code: '3', finish: true};

      fixture = TestBed.createComponent(ScoreboardComponent);
      component = fixture.componentInstance;
    })

    it('should not be affected by empty interface object', () => {
      component.data = matches;
      component.handleScore({ code: '', homeTeam: { name: '', goals: 0 }, awayTeam: { name: '', goals: 0 }, new: true});
      component.summary()

      expect(component.summaryArr.length).toBe(component.data.length);
    });

    it('should have same number of elements as main array', () => {
      component.data = matches;
      component.summary();

      expect(component.summaryArr.length).toBe(component.data.length);
      expect(component.errorMsg).toBe('');
    });
  })
});
