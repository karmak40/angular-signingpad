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
