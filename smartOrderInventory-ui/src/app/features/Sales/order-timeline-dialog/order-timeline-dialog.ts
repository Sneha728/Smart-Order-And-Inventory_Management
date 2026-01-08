import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-timeline-dialog',
  imports: [CommonModule],
  templateUrl: './order-timeline-dialog.html',
  styleUrl: './order-timeline-dialog.css',
})
export class OrderTimelineDialog {
  steps = [
    'Created',
    'Approved',
    'Packed',
    'Shipped',
    'Delivered'
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  isCompleted(step: string): boolean {
    return this.steps.indexOf(step) <= this.steps.indexOf(this.data.status);
  }
}


