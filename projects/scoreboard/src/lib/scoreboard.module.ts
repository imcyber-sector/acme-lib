import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScoreboardComponent } from './scoreboard.component';



@NgModule({
  declarations: [
    ScoreboardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScoreboardComponent
  ]
})
export class ScoreboardModule { }
