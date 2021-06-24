import { Component, Input, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { SaveService } from '../services/SaveService';

@Component({
  selector: 'app-canvas-signature',
  templateUrl: './canvas-signature.component.html',
  styleUrls: ['./canvas-signature.component.css']
})
export class CanvasSignatureComponent implements OnInit {
 
  @Input() name: string | undefined;
  @ViewChild('sigPad', {static: false}) sigPad: ElementRef | undefined;

  sigPadElement: any;
  public context: any;;
  isDrawing = false;
  img: any;

  lineWidth = 5;
  halfLineWidth = this.lineWidth / 2;
  fillStyle = '#333';
  strokeStyle = '#333';
  shadowColor = '#333';
  shadowBlur = this.lineWidth / 4;

  constructor(private saveService: SaveService) { }

  ngOnInit() {
    // do not load here because at this moment view is not loaded yet
  }

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
    this.context.clearRect(0, 0,  this.sigPadElement.width,  this.sigPadElement.height);
  }

  getMosuePositionOnCanvas (event) {
    var rect = this.sigPadElement.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) / (rect.right - rect.left) * this.sigPadElement.width,
        y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this.sigPadElement.height
    };
}

  public clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  public save() {
    this.img = this.sigPadElement.toDataURL("image/png");

    this.saveService.saveImageData(this.img).subscribe()

    console.log(this.img);
  }
}
