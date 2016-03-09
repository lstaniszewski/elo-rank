# elo-rank
ELO based ranking calculator for 2 vs 2 games, such as table soccer.


###Usage

In your script:
```
e = require('./dist/main');
eloRank = new e();
```

To calculate expected score use getExpectedScore(winnerRanking, looserRanking):
```
eloRank.getExpectedScore(1900, 1800);
> 0.64
```

To calculate points use getPoints(ranking, expectedScore, actualScore):
```
eloRank.getPoints(1900, 0.64, 1);
> 11.52
```

You can pass game data array that have to look like this:
```
gameData = [
[{name: 'player1', ranking: 1200}, {name: 'player2', ranking: 1150}],
[{name: 'player3', ranking: 1150}, {name: 'player4', ranking: 1100}]
]

```

Then use evaluate(gameData):
```
eloRank.evaluate(gameData);
> [ [ { name: 'player1', ranking: 1200, points: 7, newRanking: 1207 },
>   { name: 'player2', ranking: 1150, points: 5, newRanking: 1155 } ],
> [ { name: 'player3', ranking: 1150, points: -7, newRanking: 1143 },
>   { name: 'player4', ranking: 1100, points: -5, newRanking: 1095 } ] ]
```
