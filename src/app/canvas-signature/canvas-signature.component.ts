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

  lineWidth = 20;
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

  getMosuePositionOnCanvas(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;
  
    return { x: canvasX, y: canvasY };
  }

/*

  public onMouseDown(e: any) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  public onMouseMove(e : any) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  public onTouchDown(e: any) {
    e.preventDefault();
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  public onTouchMove(e : any) {
    if (this.isDrawing) {
      e.preventDefault();
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  private relativeCoords(event: any) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }*/

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
