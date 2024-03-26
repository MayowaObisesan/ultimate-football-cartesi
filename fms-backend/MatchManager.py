import json
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.outputs import Notice, Log
import hashlib
import random


class MatchManager:
    def __init__(self, wallet: Wallet):
        # Initializes a new instance of the MatchManager class
        self.matches = {}  # Stores matches by their ID
        self.wallet = wallet

    def list_matches(self):
        return list(self.matches.values())

    def list_user_matches(self, user):
        _matches_list = self.matches.values()
        user_list = []
        for eachMatch in _matches_list:
            if eachMatch["owner"].lower() == user.lower():
                user_list.append(eachMatch)
        return user_list

    def create_match(self, owner_id, player_data, player_hash, token, amount, match_id):
        balance = self.wallet.balance_get(owner_id)
        print(balance.__dir__())
        token_balance = balance.erc20_get(token)
        # erc20_token_balance = balance.erc20(token)
        ether_token_balance = balance.ether_get()
        print(f"Balance is: {balance} && tokenBalance is: {token_balance}")
        # print(f"ERC20 token balance", erc20_token_balance)
        print(f"Ether token balance", ether_token_balance)

        if token_balance < 2 * amount:
            raise Exception("User does not have enough balance to propose such a duel")

        self.wallet.erc20_transfer(
            owner_id, "0x0", token, amount
        )  ## How much the user is betting
        self.wallet.erc20_transfer(
            owner_id, "0x0", token, amount
        )  ## The staking as colateral

        # Creates a new match
        self.matches[match_id] = {
            "id": match_id,
            "owner": owner_id,
            "owner_data": player_data,
            "player_hash": player_hash,
            "token": token,
            "amount": amount,
            "status": "pending",  # possible statuses: pending, accepted
            "opponent": None,
        }

        return self.matches[match_id]

    def create_bet_match(self, owner_id, player_hash, token, amount, match_id):
        balance = self.wallet.balance_get(owner_id)
        print(balance.__dir__())
        token_balance = balance.erc20_get(token)
        print(f"Balance is: {balance} && tokenBalance is: {token_balance}")

        if token_balance < 2 * amount:
            raise Exception("User does not have enough balance to propose such a duel")

        self.wallet.erc20_transfer(
            owner_id, "0x0", token, amount
        )  ## How much the user is betting
        self.wallet.erc20_transfer(
            owner_id, "0x0", token, amount
        )  ## The staking as colateral

        # Creates a new match
        self.matches[match_id] = {
            "id": match_id,
            "owner": owner_id,
            "player_hash": player_hash,
            "token": token,
            "amount": amount,
            "status": "pending",  # possible statuses: pending, accepted
            "opponent": None,
        }

        return self.matches[match_id]

    def accept_match(self, match_id, opponent_id, player):
        # Accept a created pending match
        if match_id not in self.matches:
            raise Exception("This Football match does not exist.")

        _single_match = self.matches[match_id]
        if _single_match["status"] != "pending":
            raise Exception("Challenge is not available for acceptance.")

        if opponent_id == _single_match.owner_id:
            raise Exception(
                "You cannot join your own game. You can consider playing the computer instead."
            )

        balance = self.wallet.balance_get(opponent_id)
        token_balance = balance.erc20_get(_single_match["token"])
        if token_balance < _single_match["amount"]:
            raise Exception("User does not have enough balance to join this match")

        self.wallet.erc20_transfer(
            opponent_id, "0x0", _single_match["token"], _single_match["amount"]
        )  ## How much the user is betting

        _single_match["status"] = "accepted"
        _single_match["opponent"] = opponent_id
        _single_match["opponent_fighter"] = player
        _single_match["amount"] = _single_match["amount"] * 2

        res = self.simulate_match_against_human(
            _single_match["owner_data"], _single_match["player_hash"], match_id=match_id
        )

        return res

    def accept_bet_match(self, match_id, opponent_id, player):
        # Accept a pending match
        if match_id not in self.matches:
            raise Exception("This Match ID does not exist.")

        _single_match = self.matches[match_id]
        if _single_match["status"] != "pending":
            raise Exception("Challenge is not available for acceptance.")

        balance = self.wallet.balance_get(opponent_id)
        token_balance = balance.erc20_get(_single_match["token"])
        if token_balance < _single_match["amount"]:
            raise Exception("User does not have enough balance to propose such a duel")

        self.wallet.erc20_transfer(
            opponent_id, "0x0", _single_match["token"], _single_match["amount"]
        )  ## How much the user is betting

        _single_match["status"] = "accepted"
        _single_match["opponent"] = opponent_id
        _single_match["opponent_fighter"] = player

        return _single_match

    def calculate_team_strength(self, team_player_stats):
        # Used to get team strength based on each team players rating
        player_ratings = [
            each_player.get("rating") for each_player in team_player_stats
        ]
        return sum(player_ratings)

    def simulate_match_against_human(self, team1_stats, team2_stats, match_id):
        team1_strength = self.calculate_team_strength(team1_stats)
        team2_strength = self.calculate_team_strength(team2_stats)

        # Simulate home advantage
        home_advantage = random.randint(-5, 5)
        team1_strength += home_advantage

        # Calculate odds
        total_strength = team1_strength + team2_strength
        team1_win_odds = (team1_strength / total_strength) * 100
        team2_win_odds = (team2_strength / total_strength) * 100
        draw_odds = 100 - (team1_win_odds + team1_win_odds)

        # Determine the predicted winner
        if team1_strength > team2_strength:
            predicted_winner = 1
        elif team1_strength < team2_strength:
            predicted_winner = 2
        else:
            predicted_winner = 0

        return {
            "match_id": match_id,
            "match_status": predicted_winner,
            "home_odds": team1_win_odds,
            "away_odds": team2_win_odds,
            "draw_odds": draw_odds,
            "ai_speed": team2_strength / total_strength,
            "home_speed": team1_strength / total_strength,
        }

    def simulate_match_against_computer(self, team1_stats, match_id):
        team1_strength = self.calculate_team_strength(team1_stats)
        # computer_stats = self.select_random_players()
        # computer_strength = self.calculate_team_strength(computer_stats)
        computer_strength = sum([random.randint(88, 92) for _ in range(11)])
        print(f"{team1_strength} :-: {computer_strength}")

        # Simulate home advantage
        home_advantage = random.randint(-5, 5)
        team1_strength += home_advantage

        # Calculate odds
        total_strength = team1_strength + computer_strength
        team1_win_odds = ((team1_strength / 2) / total_strength) * 100
        computer_win_odds = ((computer_strength / 2) / total_strength) * 100
        # draw_odds = 100 - (team1_win_odds + team1_win_odds)
        # draw_odds = 100 - (team1_win_odds + computer_win_odds)
        draw_odds = 100 - (team1_win_odds + computer_win_odds)

        # Determine the predicted winner
        if team1_strength > computer_strength:
            predicted_winner = 1
        elif team1_strength < computer_strength:
            predicted_winner = 2
        else:
            predicted_winner = 0

        res = {
            "match_id": match_id,
            "match_status": predicted_winner,
            "home_odds": team1_win_odds,
            "away_odds": computer_win_odds,
            "draw_odds": draw_odds,
            "ai_speed": computer_strength / total_strength,
            "home_speed": team1_strength / total_strength,
        }
        print("SIMULATION RESULT: ", res)
        return res

    def select_random_players(self):
        pass

    def pay_game_winner(self, match_id, sender_id):
        # Handle game exceptions
        if match_id not in self.matches:
            raise Exception("This match ID does not exist.")

        _single_match = self.matches[match_id]
        if _single_match["status"] != "accepted":
            raise Exception(
                "Suspicious activity detected. This match has not been played."
            )

        # The winner is the one signing this transaction. So we check for this
        if (
            sender_id != _single_match["owner"]
            or sender_id != _single_match["opponent"]
        ):
            raise Exception(
                "Suspicious activity detected. Only game players can claim staked tokens."
            )

        # If no suspicious activity is detected, send the winner both players staked token
        token = _single_match["token"]
        amount = _single_match["amount"]
        self.wallet.erc20_transfer(sender_id, token, amount)

        # remove the match from the list of matches once the staked amount has been transferred
        self.matches.pop(match_id)

        return {
            "amount": amount,
            "winner": sender_id,
            "opponent": (
                _single_match["opponent"]
                if _single_match["opponent"] == sender_id
                else _single_match["owner"]
            ),
        }

    def pay_game_drawn(self, match_id):
        # Handle game exceptions
        if match_id not in self.matches:
            raise Exception("Challenge does not exist.")

        _single_match = self.matches[match_id]
        if _single_match["status"] != "accepted":
            raise Exception(
                "Suspicious activity detected. This match has not been played."
            )

        # If no suspicious activity is detected, send the winner both players staked token
        token = _single_match["token"]
        amount = _single_match["amount"]
        owner = _single_match["owner"]
        opponent = _single_match["opponent"]
        self.wallet.erc20_transfer(owner, token, amount / 2)
        self.wallet.erc20_transfer(opponent, token, amount / 2)

        # remove the match from the list of matches once the staked amount has been transferred
        self.matches.pop(match_id)

        return {"amount": amount, "winner": None}

    def _verify_player_hash(self, player, _input_hash):
        proof = hashlib.sha256(player.encode()).hexdigest()
        if _input_hash != proof:
            return False
        return True
