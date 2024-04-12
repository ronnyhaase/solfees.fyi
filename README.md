# [SOLfees.fyi](https://www.solfees.fyi/)

Check how much you\'ve spent on Solana transaction fees across all your wallets & compare with other blockchains.
![2-wide](https://github.com/ronnyhaase/solfees.fyi/assets/714368/cbeeb847-2988-469c-8079-e2e2ac4f4fd8)

## Contributing

### Ideas & Issues

New ideas on how to make SOLfees.fyi better are highly welcome!

If you face any problems, let me know!

Don't hesitate to create an issue or ping me on [X / Twitter](https://x.com/ronnyhaase)!

### Development

Following services are used to fetch the data:

- Helius for transaction history
- Birdeye for token prices
- QuickNode GraphQL for gas prices
- Dune for gas usage / Tx
- Vercel KV to cache gas data


I. Install dependencies
```
npm install
```

II. Create an `.env.local` file in the project route and add the sercrets of the services
```
BIRDEYE_KEY=12345
DUNE_KEY=12345
HELIUS_KEY=12345
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=12345
KV_REST_API_READ_ONLY_TOKEN=12345
QUICKNODE_KEY=12345
```

III. Run the development server
```
npm run dev
```

IV. Call the hooks locally to cache initial data
```
curl -X POST http://localhost:3000/hooks/update-gas-fees
curl -X POST http://localhost:3000/hooks/update-gas-usage
```

---

Copyright © 2023 - 2024, [Ronny Haase](https://ronnyhaase.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
