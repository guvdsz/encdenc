const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
	_transform(chunk, encoding, callback) {
		console.log(`Before: ${chunk}`);

		for (let i = 0; i < chunk.length; i++) {
			const value = chunk[i];

			if (value !== 255) {
				chunk[i] += 1;
			}
		}

		console.log(`After: ${chunk}`);

		callback(null, chunk);
	}
}

class Decrypt extends Transform {
	_transform(chunk, encoding, callback) {
		console.log(`Before: ${chunk}`);

		for (let i = 0; i < chunk.length; i++) {
			const value = chunk[i];

			if (value !== 255) {
				chunk[i] -= 1;
			}
		}

		console.log(`After: ${chunk}`);

		callback(null, chunk);
	}
}

decrypt();

async function encrypt() {
	const readFh = await fs.open("./read.txt", "r");
	const writeFh = await fs.open("./encrypted.txt", "w");

	const readStream = readFh.createReadStream();
	const writeStream = writeFh.createWriteStream();

	const encrypt = new Encrypt();

	readStream.pipe(encrypt).pipe(writeStream);
}

async function decrypt() {
	const readFh = await fs.open("./encrypted.txt", "r");
	const writeFh = await fs.open("./decrypted.txt", "w");

	const readStream = readFh.createReadStream();
	const writeStream = writeFh.createWriteStream();

	const decrypt = new Decrypt();

	readStream.pipe(decrypt).pipe(writeStream);
}
