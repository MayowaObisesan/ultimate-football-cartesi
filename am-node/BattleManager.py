import json
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.outputs import Notice, Log
import arena
import hashlib
import random


class BattleManager:
    def __init__(self, wallet: Wallet):
        # Initializes a new instance of the BattleManager class
        self.__challenge_counter = 0
        self.challenges = {}  # Stores challenges by their ID
        self.wallet = wallet

    def list_matches(self):
        return list(self.challenges.values())

    def list_user_matches(self, user):
        challenge_list = self.challenges.values()
        user_list = []
        for chall in challenge_list:
            if chall["owner"].lower() == user.lower():
                user_list.append(chall)
        return user_list

    def create_challenge(self, owner_id, player_hash, token, amount, match_id):
        # balance = self.wallet.balance_get(owner_id)
        # print(balance.__dir__())
        # # token_balance = balance.erc20_get(token)
        # # token_balance = balance.erc20(token)
        # token_balance = balance.ether_get()
        # print(f"Balance is: {balance} && tokenBalance is: {token_balance}")

        # if token_balance < 2 * amount:
        #     raise Exception("User does not have enough balance to propose such a duel")

        # self.wallet.erc20_transfer(
        #     owner_id, "0x0", token, amount
        # )  ## How much the user is betting
        # self.wallet.erc20_transfer(
        #     owner_id, "0x0", token, amount
        # )  ## The staking as colateral

        # Creates a new challenge
        # challenge_id = self._generate_match_id()
        self.challenges[match_id] = {
            "id": match_id,
            "owner": owner_id,
            "player_hash": player_hash,
            "token": token,
            "amount": amount,
            "status": "pending",  # possible statuses: pending, accepted
            "opponent": None,
        }

        return self.challenges[match_id]

    def create_bet_challenge(self, owner_id, player_hash, token, amount, match_id):
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

        # Creates a new challenge
        # challenge_id = self._generate_match_id()
        self.challenges[match_id] = {
            "id": match_id,
            "owner": owner_id,
            "player_hash": player_hash,
            "token": token,
            "amount": amount,
            "status": "pending",  # possible statuses: pending, accepted
            "opponent": None,
        }

        return self.challenges[match_id]

    def accept_challenge(self, challenge_id, opponent_id, player):
        # Accepts a challenge
        if challenge_id not in self.challenges:
            raise Exception("Challenge does not exist.")

        challenge = self.challenges[challenge_id]
        if challenge["status"] != "pending":
            raise Exception("Challenge is not available for acceptance.")

        if opponent_id == challenge.owner_id:
            raise Exception("You cannot join your own game")

        # balance = self.wallet.balance_get(opponent_id)
        # token_balance = balance.erc20_get(challenge["token"])
        # if token_balance < challenge["amount"]:
        #     raise Exception("User does not have enough balance to propose such a duel")

        # # d = player
        # # char2 = arena.Character(
        # #     1, d["name"], d["weapon"], d["hp"], d["atk"], d["def"], d["spd"]
        # # )
        # # if char2.is_cheater():
        # #     raise Exception("Invalid player data")

        # self.wallet.erc20_transfer(
        #     opponent_id, "0x0", challenge["token"], challenge["amount"]
        # )  ## How much the user is betting

        challenge["status"] = "accepted"
        challenge["opponent"] = opponent_id
        challenge["opponent_fighter"] = player

        return challenge

    def accept_bet_challenge(self, challenge_id, opponent_id, player):
        # Accepts a challenge
        if challenge_id not in self.challenges:
            raise Exception("Challenge does not exist.")

        challenge = self.challenges[challenge_id]
        if challenge["status"] != "pending":
            raise Exception("Challenge is not available for acceptance.")

        balance = self.wallet.balance_get(opponent_id)
        token_balance = balance.erc20_get(challenge["token"])
        if token_balance < challenge["amount"]:
            raise Exception("User does not have enough balance to propose such a duel")

        # d = player
        # char2 = arena.Character(
        #     1, d["name"], d["weapon"], d["hp"], d["atk"], d["def"], d["spd"]
        # )
        # if char2.is_cheater():
        #     raise Exception("Invalid player data")

        self.wallet.erc20_transfer(
            opponent_id, "0x0", challenge["token"], challenge["amount"]
        )  ## How much the user is betting

        challenge["status"] = "accepted"
        challenge["opponent"] = opponent_id
        challenge["opponent_fighter"] = player

        return challenge

    def calculate_team_strength(self, team_player_stats):
        player_ratings = [
            each_player.get("rating") for each_player in team_player_stats
        ]
        return sum(player_ratings)

    def simulate_match_against_human(self, challenge_id, team1_stats, team2_stats):
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
            "match_status": predicted_winner,
            "home_odds": team1_win_odds,
            "away_odds": team2_win_odds,
            "draw_odds": draw_odds,
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

        # notice_payload = result
        # notice_payload["owner_id"] = sender_id
        # notice_payload["opponent_id"] = opponent_id
        # notice_payload["game_id"] = challenge_id
        # notice_payload["fighters"] = [fighter, challenge["opponent_fighter"]]

        # report_payload = {
        #     "rounds": result["rounds"],
        #     "log": log,
        #     "game_id": challenge_id,
        # }

        # return notice_payload, report_payload

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

    def start_match(self, challenge_id, sender_id, fighter):

        if challenge_id not in self.challenges:
            raise Exception("Challenge does not exist.")
        challenge = self.challenges[challenge_id]
        if challenge["status"] != "accepted":
            raise Exception("Challenge is not yet accepted by anyone.")

        # if sender_id != challenge["owner"]:
        #     raise Exception("You are not the owner, can't start match.")

        # d = fighter
        # char1 = arena.Character(
        #     0, d["name"], d["weapon"], d["hp"], d["atk"], d["def"], d["spd"]
        # )
        # d = challenge["opponent_fighter"]
        # char2 = arena.Character(
        #     1, d["name"], d["weapon"], d["hp"], d["atk"], d["def"], d["spd"]
        # )

        opponent_id = challenge["opponent"]
        token = challenge["token"]
        amount = challenge["amount"]

        if char1.is_cheater() or not self._hash_matches_fighter(
            fighter, challenge["fighter_hash"]
        ):
            ## ends duel and player 2 gets everything, even the stake
            self.challenges.pop(challenge_id)
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)  # their money
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)  # owner money
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)  # owner stake
            return

        self.wallet.erc20_transfer(
            "0x0", sender_id, token, amount
        )  # game creator gets it's stake back

        result, log = arena.battle(char1, char2)
        self.challenges.pop(challenge_id)  # delete fight

        if result["winner"]["id"] == -1:  # and everyone gets their money back
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)
            self.wallet.erc20_transfer("0x0", sender_id, token, amount)
            return
        elif result["winner"]["id"] == 0:  # game creator wins
            self.wallet.erc20_transfer("0x0", sender_id, token, amount)
            self.wallet.erc20_transfer("0x0", sender_id, token, amount)
        else:  # opponent wins
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)
            self.wallet.erc20_transfer("0x0", opponent_id, token, amount)

        notice_payload = result
        notice_payload["owner_id"] = sender_id
        notice_payload["opponent_id"] = opponent_id
        notice_payload["game_id"] = challenge_id
        notice_payload["fighters"] = [fighter, challenge["opponent_fighter"]]

        report_payload = {
            "rounds": result["rounds"],
            "log": log,
            "game_id": challenge_id,
        }

        return notice_payload, report_payload

    def _generate_match_id(self):
        # Generates a unique match ID
        self.__challenge_counter += 1
        return self.__challenge_counter

    def _verify_player_hash(self, player, hash):
        prove = hashlib.sha256(player)

    def _hash_matches_fighter(self, fighter, hash):
        d = fighter
        input_string = "-".join(
            [
                d["name"],
                d["weapon"],
                str(d["hp"]),
                str(d["atk"]),
                str(d["def"]),
                str(d["spd"]),
            ]
        )
        prove = hashlib.sha256(input_string.encode()).hexdigest()
        if hash != prove:
            return False
        return True
