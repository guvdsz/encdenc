const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
	constructor({ totalBytes }) {
		super();
		this.bytesEncrypted = 0;
		this.chunksEcrypted = 0;
		this.totalBytes = totalBytes;
	}

	_transform(chunk, encoding, callback) {
		for (let i = 0; i < chunk.length; i++) {
			const value = chunk[i];

			if (value !== 255) {
				chunk[i] += 1;
			}
		}

		this.bytesEncrypted += chunk.length;
		this.chunksEcrypted++;

		if (
			this.chunksEcrypted === 5 ||
			this.bytesEncrypted >= this.totalBytes
		) {
			console.log(
				`Encrypted ${((this.bytesEncrypted / this.totalBytes) * 100).toFixed(2)}%`,
			);
			this.chunksEcrypted = 0;
		}

		callback(null, chunk);
	}
}

class Decrypt extends Transform {
	constructor({ totalBytes }) {
		super();
		this.bytesDecrypted = 0;
		this.chunksDecrypted = 0;
		this.totalBytes = totalBytes;
	}

	_transform(chunk, encoding, callback) {
		for (let i = 0; i < chunk.length; i++) {
			const value = chunk[i];

			if (value !== 255) {
				chunk[i] -= 1;
			}
		}

		this.bytesDecrypted += chunk.length;
		++this.chunksDecrypted;

		if (
			this.chunksDecrypted === 5 ||
			this.bytesDecrypted >= this.totalBytes
		) {
			console.log(
				`Decrypted ${((this.bytesDecrypted / this.totalBytes) * 100).toFixed(2)}%`,
			);
			this.chunksDecrypted = 0;
		}

		callback(null, chunk);
	}
}

decrypt();

async function encrypt() {
	const readFh = await fs.open("./read.txt", "r");
	const writeFh = await fs.open("./encrypted.txt", "w");

	const stats = await fs.stat("./read.txt");

	const readStream = readFh.createReadStream();
	const writeStream = writeFh.createWriteStream();

	const encrypt = new Encrypt({ totalBytes: stats.size });

	readStream.pipe(encrypt).pipe(writeStream);
}

async function decrypt() {
	const readFh = await fs.open("./encrypted.txt", "r");
	const writeFh = await fs.open("./decrypted.txt", "w");

	const stats = await fs.stat("./encrypted.txt");

	const readStream = readFh.createReadStream();
	const writeStream = writeFh.createWriteStream();

	const decrypt = new Decrypt({ totalBytes: stats.size });

	readStream.pipe(decrypt).pipe(writeStream);
}
