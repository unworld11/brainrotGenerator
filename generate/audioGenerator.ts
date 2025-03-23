import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Speechify API configuration
const SPEECHIFY_API_URL = 'https://api.sws.speechify.com/v1/audio/speech';
const SPEECHIFY_API_KEY = 'bcBnuV79sIs3NJZ_TEUI0R3FOxPnu-3YoCBRCodvFKY=';



export async function generateAudio(
	voice_id: string,
	person: string,
	line: string,
	index: number
) {
	try {
		console.log(`Generating audio for ${person} with voice_id: ${voice_id}`);

		
		const response = await fetch(SPEECHIFY_API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${SPEECHIFY_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				input: `<speak>${line}</speak>`,
				voice_id: voice_id,
				audio_format: 'mp3',
			}),
		});
		
		console.log(`Response status: ${response.status} ${response.statusText}`);
		
		if (!response.ok) {
			console.error(`Error from Speechify API: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (!data.audio_data) {
			console.error('No audio data received from Speechify');
		}
		
		// Get the audio buffer from the response
		const audioBuffer = Buffer.from(data.audio_data, 'base64');
		
		// Write the buffer to a file
		fs.writeFileSync(`public/voice/${person}-${index}.mp3`, audioBuffer);
		
		return Promise.resolve('Audio file saved successfully');
	} catch (error) {
		console.error('Error in generateAudio:', error);
	}
}
