(function(self) {
	self.PlaceAPI = {
		initialized: false,
		width: 0,
		height: 0,


		init(opts) {
			// defaults
			opts = Object.assign({
				modhash: r.config.modhash
			}, opts);

			return new Promise((resolve, reject) => {
				if (this.initialized) resolve();

				this.headers = {
					"x-modhash": opts.modhash
				};
				this.width = r.config.place_canvas_width;
				this.height = r.config.place_canvas_height;
				this.initialized = true;
			});
		},

		downloadBitmap() {
			return fetch("https://www.reddit.com/api/place/board-bitmap", {
					headers: this.headers
				})
				.then(res => res.arrayBuffer());
		},

		parseBitmap(input) {
			const buf = new Uint8Array(input.buffer, 4);
			const out = new Uint8Array(this.width * this.height);
			for (let i = 0; i < input.byteLength; i++) {
				out[2 * i] = buf[i] >> 4;
				out[2 * i + 1] = buf[i] & 15;
			}

			return out;
		},

		getBitmapArray() {
			return this.downloadBitmap()
				.then(buf => PlaceAPI.parseBitmap(new Uint8Array(buf)));
		}
	};
})(window);
