import json
import sys
import urllib.request
import time
from collections import OrderedDict

COMLINK = "https://free-comlink.onrender.com"
GL_IDS = frozenset({
    "GLREY", "SUPREMELEADERKYLOREN", "GLLEIA", "GRANDMASTERLUKE",
    "LORDVADER", "GLHONDO", "SITHPALPATINE", "JEDIMASTERKENOBI",
    "GLAHSOKATANO", "JABBATHEHUTT", "CAPITALEXECUTOR",
    "CAPITALLEVIATHAN", "CAPITALPROFUNDITY",
})


def comlink_post(path: str, payload: dict) -> dict:
    data = json.dumps({"payload": payload}).encode()
    req = urllib.request.Request(f"{COMLINK}{path}", data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def extract_gls(player_data: dict) -> list[str]:
    gls = []
    for unit in player_data.get("rosterUnit", []):
        base_id = unit.get("definitionId", "").split(":")[0]
        if base_id in GL_IDS:
            gls.append(base_id)
    return sorted(set(gls))


def main():
    guild_id = sys.argv[1]

    print(f"Fetching guild {guild_id}...", flush=True)
    guild = comlink_post("/guild", {"guildId": guild_id, "includeRecentGuildActivityInfo": False})

    members = guild.get("guild", {}).get("member", [])
    print(f"Guild has {len(members)} members", flush=True)

    scan = OrderedDict()
    total_gls = {gl: 0 for gl in GL_IDS}

    for i, m in enumerate(members):
        player_id = m["playerId"]
        name = m["playerName"]
        print(f"[{i+1}/{len(members)}] {name}...", flush=True)

        try:
            player = comlink_post("/player", {"playerId": player_id})
            gls = extract_gls(player)
            scan[player_id] = {"name": name, "gls": gls}
            for gl in gls:
                total_gls[gl] = total_gls.get(gl, 0) + 1
        except Exception as e:
            print(f"  Error: {e}", flush=True)
            scan[player_id] = {"name": name, "gls": []}

        time.sleep(0.5)

    result = {
        "guildId": guild_id,
        "guildName": guild.get("guild", {}).get("profile", {}).get("name", ""),
        "scannedAt": int(time.time()),
        "totalMembers": len(members),
        "members": scan,
        "counts": {k: total_gls.get(k, 0) for k in GL_IDS},
    }

    with open("gl-data.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nDone. Scanned {len(members)} members. Output: gl-data.json", flush=True)


if __name__ == "__main__":
    main()
