(function(self) {
	self.PlaceAPI = {
		initialized: false,
		width: 1000,
		height: 1000,
		

		init() {
			return new Promise((resolve, reject) => {
				if (this.initialized) resolve();

				this.width = r.config.place_canvas_width;
				this.height = r.config.place_canvas_height;
				this.initialized = true;
			});
		},

		parseBitmap(input) {
			const out = new Uint8Array(this.width * this.height);
			const buf = new Uint8Array(input.buffer, 4);
			for (let i = 0; i < input.byteLength; i++) {
				out[2 * i] = buf[i] >> 4, out[2 * i + 1] = buf[i] & 15;
			}

			return out;
		},

		downloadBitmap() {
			return fetch("https://www.reddit.com/api/place/board-bitmap", {
					credentials: "include"
				})
				.then(res => res.arrayBuffer());
		},
		
		getBitmapArray() {
			return this.downloadBitmap()
				.then(buf => PlaceAPI.parseBitmap(new Uint8Array(buf)));
		}
	};
})(window);
