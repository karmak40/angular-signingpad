import { Component, Input, ViewChild, OnInit, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { SaveService } from '../services/SaveService';

@Component({
  selector: 'app-canvas-signature',
  templateUrl: './canvas-signature.component.html',
  styleUrls: ['./canvas-signature.component.css']
})
export class CanvasSignatureComponent implements OnInit {

  @ViewChild('sigPad', { static: false }) sigPad: ElementRef | undefined;

  sigPadElement: any;
  public context: any;
  isDrawing = false;
  img: any;

  //@Input() width: number = 300;
  //@Input() height: number = 150;
  @Input() lineWidth: number = 5;
  @Input() fillStyle: string = '#333';
  @Input() strokeStyle: string = '#333';
  @Input() shadowColor: string = '#333';

  @Output() imageSaveEvent = new EventEmitter<string>();

  halfLineWidth = this.lineWidth / 2;
  shadowBlur = this.lineWidth / 4;

  constructor(private saveService: SaveService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    console.log('sigPad on after view init', this.sigPad);
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#3742fa';
  }

  @HostListener('document:mouseup', ['$event'])
  public onMouseUp(e: any) {
    this.isDrawing = false;
  }

  @HostListener('document:drawend', ['$event'])
  public oTouchUp(e: any) {
    this.isDrawing = false;
  }

  public handleWritingStart(event) {
    event.preventDefault();

    const mousePos = this.getMosuePositionOnCanvas(event);

    this.context.beginPath();

    this.context.moveTo(mousePos.x, mousePos.y);

    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.strokeStyle;
    this.context.shadowColor = null;
    this.context.shadowBlur = null;

    this.context.fill();

    this.isDrawing = true;
  }

  public handleWritingInProgress(event) {
    event.preventDefault();

    if (this.isDrawing) {
      const mousePos = this.getMosuePositionOnCanvas(event);

      this.context.lineTo(mousePos.x, mousePos.y);
      this.context.stroke();
    }
  }

  public handleDrawingEnd(event) {
    event.preventDefault();

    if (this.isDrawing) {
      this.context.shadowColor = this.shadowColor;
      this.context.shadowBlur = this.shadowBlur;

      this.context.stroke();
    }

    this.isDrawing = false;
  }

  public handleClearButtonClick(event) {
    event.preventDefault();

    this.clearCanvas();
  }

  public clearCanvas() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
  }

  getMosuePositionOnCanvas(event) {
    var rect = this.sigPadElement.getBoundingClientRect();
    return {
      x: ((event.clientX || event.touches[0].clientX) - rect.left) / (rect.right - rect.left) * this.sigPadElement.width,
      y: ((event.clientY || event.touches[0].clientY) - rect.top) / (rect.bottom - rect.top) * this.sigPadElement.height
    };
  }

  public clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  public save() {
    this.img = this.sigPadElement.toDataURL("image/png");
    this.imageSaveEvent.emit(this.img);
  }
}
