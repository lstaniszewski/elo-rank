'use strict';

class EloRank {

    constructor(options) {
        let defaults = {
            kFactor: 32,
            nValue: 400
        };
        this.winnerScore = 1;
        this.looserScore = 0;

        this.settings = Object.assign({}, defaults, options);
    }

    evaulatePlayersPoints(playerHigh, playerLow, teamPoints) {
        let RankingSum = playerHigh.ranking + playerLow.ranking;

        let playerHighPoints = Math.round(teamPoints * this.getExpectedScore(playerHigh.ranking, playerLow.ranking));
        let playerLowPoints = Math.round(teamPoints - playerHighPoints);

        playerHigh.points = playerHighPoints;
        playerHigh.newRanking = playerHigh.ranking + playerHigh.points;

        playerLow.points = playerLowPoints;
        playerLow.newRanking = playerLow.ranking + playerLow.points;

        return [playerHigh, playerLow];
    }

    evaulatePlayers(team, points) {
        if(team[0].ranking >= team[1].ranking) {
            return this.evaulatePlayersPoints(team[0], team[1], points);
        } else {
            return this.evaulatePlayersPoints(team[1], team[0], points);
        }
    }

    getPoints(rank, expScore, score) {
        return this.settings.kFactor*(score-expScore);
    }

    getExpectedScore(rankA, rankB) {

        let denominator = 1 + Math.pow(10, ((rankB-rankA)/this.settings.nValue));
        let formula = 1/denominator;

        return parseFloat(formula.toFixed(3));
    }

    getTeamRankingSum(team) {

        if(typeof team[0].ranking !== 'number' || typeof team[1].ranking !== 'number') {
            throw new Error('gameData has incorrect format: player ranking should be number');
        }

        return team[0].ranking + team[1].ranking;
    }

    evaluateTeams(teamA, teamB) {

        if(teamA.length !== 2 || teamB.length !== 2) {
            throw new Error('gameData has incorrect format: teams should have two players');
        }

        let teamARankingSum = this.getTeamRankingSum(teamA);
        let teamBRankingSum = this.getTeamRankingSum(teamB);

        let teamAExpectedScore = this.getExpectedScore(teamARankingSum, teamBRankingSum);
        let teamBExpectedScore = this.getExpectedScore(teamBRankingSum, teamARankingSum);

        let teamAPoints = this.getPoints(teamARankingSum, teamAExpectedScore, this.winnerScore);
        let teamBPoints = this.getPoints(teamBRankingSum, teamBExpectedScore, this.looserScore);

        teamA = this.evaulatePlayers(teamA, teamAPoints);
        teamB = this.evaulatePlayers(teamB, teamBPoints);

        return [teamA, teamB];
    }

    evaluate(gameData) {
        // Assuming:
        // gameData is list of two teams containing two players each
        // First team is always winner side
        // Each player object contains name and oldRanking key
        //
        // Function returns gameData object in which
        // each player now also have newRanking and rankingDiff

        if(gameData.length !== 2) {
            throw new Error('gameData has incorrect format: gameData should have two teams');
        }

        let result = this.evaluateTeams(gameData[0], gameData[1]);

        return result;
    }
}

module.exports = EloRank;
