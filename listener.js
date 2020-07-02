module.exports = class listener {
  constructor(cb) {
    this.start = 0;
    this.done = 0;
    this.total = 0;
    this.time_left = 0;

    this.onAction = (chunk, isDone) => {
      if (isDone) {
        return cb({
          percentage: 100,
          time_left: 0,
          file_size: this.total,
          uploaded_bytes: this.total,
        });
      }
      let info = this.update(chunk);
      cb(info);
    };
  }

  update(addition) {
    let step = addition.toString().length;
    this.done = this.done + step;

    let speed = this.done / (Date.now() - this.start);
    let left = this.total - this.done;
    this.time_left = left / speed;

    return {
      percentage: Math.round((this.done / this.total) * 100),
      time_left: Math.round(this.time_left),
      file_size: this.total,
      uploaded_bytes: this.done,
    };
  }

  setStart(milis) {
    this.start = milis;
  }
  setTotal(total) {
    this.total = total;
  }
};
