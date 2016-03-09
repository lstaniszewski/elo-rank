'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EloRank = function () {
    function EloRank(options) {
        _classCallCheck(this, EloRank);

        var defaults = {
            kFactor: 32,
            nValue: 400
        };
        this.winnerScore = 1;
        this.looserScore = 0;

        this.settings = Object.assign({}, defaults, options);
    }

    _createClass(EloRank, [{
        key: 'evaulatePlayersPoints',
        value: function evaulatePlayersPoints(playerHigh, playerLow, teamPoints) {
            var RankingSum = playerHigh.ranking + playerLow.ranking;

            var playerHighPoints = Math.round(teamPoints * this.getExpectedScore(playerHigh.ranking, playerLow.ranking));
            var playerLowPoints = Math.round(teamPoints - playerHighPoints);

            playerHigh.points = playerHighPoints;
            playerHigh.newRanking = playerHigh.ranking + playerHigh.points;

            playerLow.points = playerLowPoints;
            playerLow.newRanking = playerLow.ranking + playerLow.points;

            return [playerHigh, playerLow];
        }
    }, {
        key: 'evaulatePlayers',
        value: function evaulatePlayers(team, points) {
            if (team[0].ranking >= team[1].ranking) {
                return this.evaulatePlayersPoints(team[0], team[1], points);
            } else {
                return this.evaulatePlayersPoints(team[1], team[0], points);
            }
        }
    }, {
        key: 'getPoints',
        value: function getPoints(rank, expScore, score) {
            return this.settings.kFactor * (score - expScore);
        }
    }, {
        key: 'getExpectedScore',
        value: function getExpectedScore(rankA, rankB) {

            var denominator = 1 + Math.pow(10, (rankB - rankA) / this.settings.nValue);
            var formula = 1 / denominator;

            return parseFloat(formula.toFixed(3));
        }
    }, {
        key: 'getTeamRankingSum',
        value: function getTeamRankingSum(team) {

            if (typeof team[0].ranking !== 'number' || typeof team[1].ranking !== 'number') {
                throw new Error('gameData has incorrect format: player ranking should be number');
            }

            return team[0].ranking + team[1].ranking;
        }
    }, {
        key: 'evaluateTeams',
        value: function evaluateTeams(teamA, teamB) {

            if (teamA.length !== 2 || teamB.length !== 2) {
                throw new Error('gameData has incorrect format: teams should have two players');
            }

            var teamARankingSum = this.getTeamRankingSum(teamA);
            var teamBRankingSum = this.getTeamRankingSum(teamB);

            var teamAExpectedScore = this.getExpectedScore(teamARankingSum, teamBRankingSum);
            var teamBExpectedScore = this.getExpectedScore(teamBRankingSum, teamARankingSum);

            var teamAPoints = this.getPoints(teamARankingSum, teamAExpectedScore, this.winnerScore);
            var teamBPoints = this.getPoints(teamBRankingSum, teamBExpectedScore, this.looserScore);

            teamA = this.evaulatePlayers(teamA, teamAPoints);
            teamB = this.evaulatePlayers(teamB, teamBPoints);

            return [teamA, teamB];
        }
    }, {
        key: 'evaluate',
        value: function evaluate(gameData) {
            // Assuming:
            // gameData is list of two teams containing two players each
            // First team is always winner side
            // Each player object contains name and oldRanking key
            //
            // Function returns gameData object in which
            // each player now also have newRanking and rankingDiff

            if (gameData.length !== 2) {
                throw new Error('gameData has incorrect format: gameData should have two teams');
            }

            var result = this.evaluateTeams(gameData[0], gameData[1]);

            return result;
        }
    }]);

    return EloRank;
}();

module.exports = EloRank;