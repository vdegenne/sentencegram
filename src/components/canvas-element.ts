import { css, html, LitElement, PropertyValueMap } from 'lit';
import { connect } from 'lit-redux-watch';
import { customElement, property, query } from 'lit/decorators.js';
import { CANVAS_BACKGROUND } from '../constants.js';
import { store } from '../redux/store.js';



@customElement('canvas-element')
export class CanvasElement extends connect(store)(LitElement) {
  @property()
  private content

  private canvas!: fabric.Canvas;

  @query('canvas') canvasElement!: HTMLCanvasElement;

  static styles = css`
  .canvas-container {
    margin: 0 auto;
    width: 100% !important;
    height: min(100vw, 640px) !important;
    max-width: 640px;
    max-height: 640px;
  }
  canvas {
    width: 100% !important;
    height: 100% !important;
    /* max-width: 640px; */
  }
  `

  render () {
    return html`<canvas width=640 height=640></canvas>`
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.initCanvas()

    // window.addEventListener('resize', () => {
    //   this.setCanvasHeight()
    // })
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('content')) {
      this.loadContent(this.content || `{"backgroundColor" : "${CANVAS_BACKGROUND}"}`)
    }
  }


  initCanvas () {
    this.canvas = new fabric.Canvas(this.canvasElement, {
      isDrawingMode: true,
      backgroundColor: CANVAS_BACKGROUND
    })
    // this.canvas.setHeight(window.innerHeight);
    // this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
    this.canvas.freeDrawingBrush.width = 8;
    this.canvas.freeDrawingBrush.color = '#ffffff'
    // this.resizeCanvas()
  }

  setCanvasHeight() {
    const maxWidth = 640
    // this.canvas.setWidth(Math.min(window.innerWidth, maxWidth));
    this.canvas.setHeight(Math.min(window.innerWidth, maxWidth));
    this.canvas.renderAll();
  }

  toggleDrawingMode () {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }

  loadContent (serialized: string) {
    this.canvas.loadFromJSON(JSON.parse(serialized), () => {})
  }

  serializeContent () {
    return JSON.stringify(this.canvas)
  }

  clear () {
    this.canvas.clear()
    this.canvas.setBackgroundColor(CANVAS_BACKGROUND, () => {})
  }
}