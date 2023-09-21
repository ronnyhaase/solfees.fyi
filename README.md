# [SOLfees.fyi](https://www.solfees.fyi/)
Check how much a Solana wallet has spent on transaction fees & compare with other blockchains.

## Contributing

### Ideas & Issues
New ideas on how to make SOLfees.fyi better are highly welcome!

If you face any problems, let me know!

Don't hesitate to create an issue or ping me on [X / Twitter](https://x.com/ronnyhaase)!

### Development
Install dependencies
```
npm install
```
Create an `.env.local` file and add your Helius and QuickNode API key
```
touch .env.local
echo HELIUS_KEY=YOUR_HELIUS_KEY >> .env.local
echo QUICKNODE_KEY=YOU_QUICKNODE_KEY >> .env.local
```
Run the development server
```
npm run dev
```

Copyright © 2023, [Ronny Haase](https://ronnyhaase.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
