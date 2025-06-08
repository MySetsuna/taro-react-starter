Component({
  properties: {
    // icon | moments | mine | magazine
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 46,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * qq.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    svgSize: 46 / 750 * qq.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
});
