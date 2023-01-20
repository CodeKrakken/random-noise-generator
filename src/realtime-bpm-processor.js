import { realtimeBpmProcessorName } from './consts';
import { RealTimeBpmAnalyzer } from './realtime-bpm-analyzer';

/**
 * @class RealTimeBpmProcessor
 * @extends AudioWorkletProcessor
 **/
export class RealTimeBpmProcessor extends AudioWorkletProcessor {
  /**
   * Determine the buffer size (this is the same as the 1st argument of ScriptProcessor)
   */
  bufferSize = 4096;

  /**
   * Track the current buffer fill level
   */
  _bytesWritten = 0;

  /**
   * Create a buffer of fixed size
   */
  _buffer = new Float32Array(this.bufferSize);

  /**
   * RealTimeBpmAnalzer
   */
  realTimeBpmAnalyzer = new RealTimeBpmAnalyzer();

  constructor() {
    super();

    /**
     * Initializing
     */
    this.initBuffer();

    this.port.addEventListener('message', this.onMessage.bind(this));
    this.port.start();
  }

  onMessage(event) {
    if (event.data.message === 'ASYNC_CONFIGURATION') {
      for (const key of Object.keys(event.data.parameters)) {
        this.realTimeBpmAnalyzer.setAsyncConfiguration(key, event.data.parameters[key]);
      }
    }
  }

  /**
   * Set bytesWritten to 0
   */
  initBuffer() {
    this._bytesWritten = 0
  }

  /**
   * Returns a boolean to know if the buffer if empty
   * @returns {boolean} true if bytesWritten is equal 0
   */
  isBufferEmpty() {
    return this._bytesWritten === 0
  }

  /**
   * Returns a boolean to know if the buffer if full
   * @returns {boolean} true if the bytesWritten is equal bufferSize
   */
  isBufferFull() {
    return this._bytesWritten === this.bufferSize
  }

  /**
   * 
   * @param inputs 
   * @param _outputs 
   * @param _parameters 
   * @returns 
   */
  process(inputs, _outputs, _parameters) {
    this.append(inputs[0][0])

    if (this.isBufferFull()) {
      this.realTimeBpmAnalyzer.analyze(this._buffer, sampleRate, this.bufferSize, (event) => {
        this.port.postMessage(event);
      });
    }

    return true;
  }

  /**
   * Append the new chunk to the buffer (with a bufferSize of 4096)
   * @param {Float32Array} channelData
   */
  append(channelData) {
    if (this.isBufferFull()) {
      this.flush();
    }

    if (!channelData) {
      return;
    }

    for (const data of channelData) {
      this._buffer[this._bytesWritten++] = data;
    }
  }
  
  /**
   * Flush memory buffer
   */
  flush() {
    this.initBuffer()
  }
}

/**
 * Mandatory Registration to use the processor
 */
registerProcessor(realtimeBpmProcessorName, RealTimeBpmProcessor);