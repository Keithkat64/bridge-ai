# Converted Stayman Logic from text to Python

def get_stayman_response(opener, responder_bid):
    '''
    opener: dict with keys like 'hearts', 'spades', 'hcp', 'shortage_points'
    responder_bid: str, e.g. '2NT', '3C', '3H', '4NT'
    returns: str, bid by opener
    '''
    tp = opener['hcp'] + opener.get('shortage_points', 0)
    has_4_hearts = opener.get('hearts', 0) == 4
    has_4_spades = opener.get('spades', 0) == 4
    has_5_minor = opener.get('minor_len', 0) >= 5
    has_minor_honours = opener.get('minor_honours', 0) >= 2

    if opener['stayman_response'] == '2H':
        if responder_bid == '3H':
            return '4H' if tp >= 18 else 'PASS'
        elif responder_bid == '2NT':
            if has_4_spades:
                return '4S' if tp >= 18 else '3S'
            else:
                return '3NT' if opener['hcp'] == 18 else 'PASS'
        elif responder_bid == '3NT':
            return '4S' if has_4_spades else 'PASS'
        elif responder_bid in ['3C', '3D']:
            if has_4_spades:
                return '3S' if tp >= 18 else '4S'
            elif opener.get('supports_minor') == responder_bid[-1]:
                return '4' + responder_bid[-1]
            else:
                return '3NT'
        elif responder_bid == '4H':
            return 'PASS'
        elif responder_bid == '4NT':
            return 'RKCB'

    elif opener['stayman_response'] == '2S':
        if responder_bid == '3S':
            return '4S' if tp >= 18 else 'PASS'
        elif responder_bid == '2NT':
            return '3NT' if opener['hcp'] == 18 else 'PASS'
        elif responder_bid == '3NT':
            return 'PASS'
        elif responder_bid in ['3C', '3D']:
            if opener.get('supports_minor') == responder_bid[-1]:
                return '4' + responder_bid[-1]
            else:
                return '3NT'
        elif responder_bid == '4S':
            return 'PASS'
        elif responder_bid == '4NT':
            return 'RKCB'

    elif opener['stayman_response'] == '2D':
        if responder_bid == '2NT':
            if opener['hcp'] == 18:
                return '3NT'
            elif opener['hcp'] == 17 and has_5_minor:
                return '3NT' if has_minor_honours else 'PASS'
            else:
                return 'PASS'
        elif responder_bid == '3NT':
            return 'PASS'
        elif responder_bid == '4NT':
            return 'RKCB'

    return 'UNKNOWN'