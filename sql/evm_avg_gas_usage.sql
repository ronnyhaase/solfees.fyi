-- Dune query for average gas usages of EVM chains

WITH
  arbitrum AS (SELECT AVG(gas_used) AS avg_gas_used FROM arbitrum.transactions),
  bnb AS (SELECT AVG(gas_used) AS avg_gas_used FROM bnb.transactions),
  ethereum AS (SELECT AVG(gas_used) AS avg_gas_used FROM ethereum.transactions),
  optimism AS (SELECT AVG(gas_used) AS avg_gas_used FROM optimism.transactions),
  polygon AS (SELECT AVG(gas_used) AS avg_gas_used FROM polygon.transactions)
SELECT
  ROUND(arbitrum.avg_gas_used) AS arbitrum,
  ROUND(bnb.avg_gas_used) AS bnb,
  ROUND(ethereum.avg_gas_used) AS ethereum,
  ROUND(optimism.avg_gas_used) AS optimism,
  ROUND(polygon.avg_gas_used) AS polygon
FROM
  arbitrum
  LEFT JOIN bnb ON TRUE
  LEFT JOIN ethereum ON TRUE
  LEFT JOIN optimism ON TRUE
  LEFT JOIN polygon ON TRUE
