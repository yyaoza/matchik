import csv
import json
import time

import requests

missing_founded_dates = {'300milligrams@500startups': '2012', 'check-my-campus@fbFund': '0000',
                         'gopillar-academy@500startups': '2018', 'cognito-networks@TheAlchemistAccelerator': '2014',
                         'hykso-inc@y combinator': '2013', 'itoi@TheAlchemistAccelerator': '2014',
                         'newsbrane@fbFund': '2008',
                         'photos-i-like@fbFund': '0000', 'realgifts@fbFund': '0000',
                         'sendtask@TheAlchemistAccelerator': '2012', 'storytree@500startups': '2011',
                         'speakergram@500startups': '2011', 'tenfoot@UpwestLabs': '2011',
                         'translate-abroad@500startups': '2011'}

missing_locations = {}
all_path = 'final_allOrg001.csv'
acc_path = 'final_accOrg001.csv'


def get_max(list_elements):
    max_founder = 0

    max_element = {}
    max_founder_found = False
    while not max_founder_found:
        max_founder += 1
        for element in list_elements:
            if 'founder' + str(max_founder) in list_elements[element]:
                max_founder_found = False
                break
            else:
                max_founder_found = True
    max_founder -= 1

    max_funds = 0
    max_funds_found = False
    while not max_funds_found:
        for element in list_elements:
            if 'fund ' + str(max_funds) in list_elements[element]:
                max_funds_found = False
                break
            else:
                max_funds_found = True
        max_funds += 1
    max_funds -= 1

    max_element = ['name', 'permalink', 'schools', 'school_subjects', 'founded_on', 'location', 'undisclosed_amount',
                   'categories', 'num_fund_rounds']

    for x in range(max_founder):
        max_element.append('founder' + str(x + 1))
        max_element.append('job_titles' + str(x + 1))

    for x in range(max_funds):
        max_element.append('fund ' + str(x))

    return max_element


def load_csv_to_dict(csv_path):
    print('loading ', csv_path, ' to DICT...')
    the_dict = {}
    with open(csv_path, encoding='utf-8-sig') as CSVFile:
        csv_reader = csv.DictReader(CSVFile)
        for rows in csv_reader:
            chunk = rows[csv_reader.fieldnames[0]]
            the_dict[chunk] = rows
    # the_dict = {k.lower(): v for k, v in dict_accOrgPermalinks.items()}
    return the_dict


def scan(input_f, output, acc, start_pos, stop_pos):
    dict_orgPermalinks = load_csv_to_dict(input_f)

    temp_dict_accOrgPermalinks = {}
    total_count = 0
    for key in dict_orgPermalinks:
        total_count += 1
        if start_pos <= total_count <= stop_pos:
            print(total_count, ' of ', len(dict_orgPermalinks))
            URL = ['https://api.crunchbase.com/api/v4/entities/organizations/',
                   dict_orgPermalinks[key]['permalink'],
                   '?card_ids=founders,raised_funding_rounds',
                   '&field_ids=founded_on,location_identifiers',
                   '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
            URL = ''.join(URL)
            # noinspection PyBroadException
            try:
                r = requests.get(url=URL)
            except Exception as e:
                write_file(temp_dict_accOrgPermalinks, output)
                break
            if r.status_code == 429:
                keep_trying = True
                while keep_trying:
                    time.sleep(10)
                    r = requests.get(url=URL)
                    print('**Keep trying', r, r.text)
                    if r.status_code == 200:
                        keep_trying = False
            elif r.status_code == 200:
                print(r, r.text)
                r_json = json.loads(r.text)
                # load from csv
                temp_dict_accOrgPermalinks[key] = dict_orgPermalinks[key]
                # temp_dict_accOrgPermalinks[key]['schools'] = ''
                # temp_dict_accOrgPermalinks[key]['founded_on'] = ''
                # temp_dict_accOrgPermalinks[key]['location'] = ''
                # temp_dict_accOrgPermalinks[key]['undisclosed'] = ''
                # temp_dict_accOrgPermalinks[key]['rounds'] = 0
                # temp_dict_accOrgPermalinks[key]['categories'] = ''
                # before we load from Crunchbase, check if the founders match
                founder_name = ''
                founder_names = ''
                # temp_dict_accOrgPermalinks[key]['perfect_match'] = 'no'
                if 'cards' in r_json and 'founders' in r_json['cards']:

                    school_subjects = ''
                    school_names = ''
                    num_founders = 0
                    for founder in r_json['cards']['founders']:
                        job_titles = ''
                        num_founders += 1
                        # get the schools
                        URL = ['https://api.crunchbase.com/api/v4/entities/people/',
                               founder['identifier']['permalink'],
                               '?card_ids=degrees,jobs',
                               '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
                        URL = ''.join(URL)
                        # noinspection PyBroadException
                        try:
                            r_ppl = requests.get(url=URL)
                        except Exception as e:
                            write_file(temp_dict_accOrgPermalinks, output)
                            break
                        if r_ppl.status_code == 429:
                            keep_trying = True
                            while keep_trying:
                                time.sleep(10)
                                r_ppl = requests.get(url=URL)
                                print('**Keep trying', r_ppl, r_ppl.text)
                                if r_ppl.status_code == 200:
                                    keep_trying = False
                        elif r_ppl.status_code == 200:
                            print(r_ppl, r_ppl.text)
                            r_json_founders = json.loads(r_ppl.text)
                            for degrees in r_json_founders['cards']['degrees']:
                                school_name = degrees['school_identifier']['permalink']
                                school_names = school_names + school_name + ', '
                                if 'subject' in degrees:
                                    school_subjects = school_subjects + degrees['subject'] + ', '

                            for jobs in r_json_founders['cards']['jobs']:
                                job_titles = job_titles + jobs['title'] + ', '

                            # founder_name = founder['identifier']['value']
                            # founder_names = founder_names + founder['identifier']['permalink'] + ', '
                            # if acc:

                                # if temp_dict_accOrgPermalinks[key]['founders'] == founder_name or \
                                #         temp_dict_accOrgPermalinks[key]['founders'].find(founder_name):
                                #     temp_dict_accOrgPermalinks[key]['perfect_match'] = 'yes'
                                #     break
                            # if founder['identifier']['permalink']:
                            temp_dict_accOrgPermalinks[key]['founder' + str(num_founders)] = founder['identifier']['permalink']
                            # else:
                            #     temp_dict_accOrgPermalinks[key]['founder' + str(num_founders)] = ''
                            # if job_titles:
                            temp_dict_accOrgPermalinks[key]['job_titles' + str(num_founders)] = job_titles[:-2]
                            # else:
                            #     temp_dict_accOrgPermalinks[key]['job_titles' + str(num_founders)] = ''

                # if temp_dict_accOrgPermalinks[key]['perfect_match'] == 'no' and founder_names:

                temp_dict_accOrgPermalinks[key]['schools'] = school_names[:-2]
                temp_dict_accOrgPermalinks[key]['school_subjects'] = school_subjects[:-2]

                # + ', '
                # if temp_dict_accOrgPermalinks[key]['founders'] == founder_names[:-2]:
                #     temp_dict_accOrgPermalinks[key]['perfect_match'] = 'yes'
                # else:
                #     temp_dict_accOrgPermalinks[key]['perfect_match'] = 'no'

                # load from Crunchbase
                if 'properties' in r_json:
                    temp_dict_accOrgPermalinks[key]['name'] = r_json['properties']['identifier']['value']
                    if 'founded_on' not in r_json['properties']:
                        if key in missing_founded_dates:
                            temp_dict_accOrgPermalinks[key]['founded_on'] = missing_founded_dates[key]
                    else:
                        temp_dict_accOrgPermalinks[key]['founded_on'] = r_json['properties']['founded_on']['value'][0:4]
                    if 'location_identifiers' not in r_json['properties']:
                        if key in missing_locations:
                            temp_dict_accOrgPermalinks[key]['location'] = missing_locations[key]
                    else:
                        temp_dict_accOrgPermalinks[key]['location'] = r_json['properties']['location_identifiers'][0][
                                                                          'value'] + ', ' + \
                                                                      r_json['properties']['location_identifiers'][1][
                                                                          'value']
                if 'founded_on' in temp_dict_accOrgPermalinks[key]:
                    founded_on = int(temp_dict_accOrgPermalinks[key]['founded_on'])
                if acc:
                    cohort_year = int(temp_dict_accOrgPermalinks[key]['cohort_year'])
                    total_funding = 0
                    # calculating funding from founded to cohort years
                    for funding_rounds in r_json['cards']['raised_funding_rounds']:
                        announced_on = int(funding_rounds['announced_on'][0:4])
                        if founded_on <= announced_on <= cohort_year:
                            if 'money_raised' in funding_rounds:
                                total_funding += funding_rounds['money_raised']['value_usd']
                            else:
                                temp_dict_accOrgPermalinks[key]['undisclosed_amount'] = 'yes'
                                # temp_dict_accOrgPermalinks[key]['fund ' + str(count)] = 0
                        if 'funded_organization_categories' in funding_rounds:
                            categories_all = ''
                            for categories in funding_rounds['funded_organization_categories']:
                                categories_all = categories_all + categories['value'] + ", "
                            temp_dict_accOrgPermalinks[key]['categories'] = categories_all[:-2]
                        else:
                            temp_dict_accOrgPermalinks[key]['categories'] = 'empty'

                    temp_dict_accOrgPermalinks[key]['total_funding'] = total_funding
                    if 'undisclosed_amount' not in temp_dict_accOrgPermalinks[key]:
                        temp_dict_accOrgPermalinks[key]['undisclosed_amount'] = 'no'
                else:
                    count = 0
                    temp_dict_accOrgPermalinks[key]['undisclosed_amount'] = 'no'
                    if 'cards' in r_json:
                        for funding_rounds in r_json['cards']['raised_funding_rounds']:
                            if 'money_raised' in funding_rounds:
                                temp_dict_accOrgPermalinks[key]['fund ' + str(count)] = \
                                    funding_rounds['announced_on'][0:4] + ':' + \
                                    str(funding_rounds['money_raised']['value_usd'])
                            else:
                                temp_dict_accOrgPermalinks[key]['undisclosed_amount'] = 'yes'
                                temp_dict_accOrgPermalinks[key]['fund ' + str(count)] = 0
                            count += 1
                            if 'funded_organization_categories' in funding_rounds:
                                categories_all = ''
                                for categories in funding_rounds['funded_organization_categories']:
                                    categories_all = categories_all + categories['value'] + ", "
                                temp_dict_accOrgPermalinks[key]['categories'] = categories_all[:-2]
                            else:
                                temp_dict_accOrgPermalinks[key]['categories'] = 'empty'
                            # temp_dict_accOrgPermalinks[key]['fund_amount ' + str(count)] = \
                            # funding_rounds['money_raised']['value_usd']
                        temp_dict_accOrgPermalinks[key]['num_fund_rounds'] = count

            # if len(temp_dict_accOrgPermalinks) > 5:
            #     break

    write_file(temp_dict_accOrgPermalinks, output)

    # print('done')


def search(output_path, start_pos, stop_pos):
    dict_accOrg = load_csv_to_dict(acc_path)
    dict_allOrg = load_csv_to_dict(all_path)

    matches = {}
    count = 0
    # by date, location, school, funding
    for accs in dict_accOrg:
        if start_pos <= count <= stop_pos:
            print('processing ', count, ' of ', len(dict_accOrg))
            matches[accs] = {}
            matches[accs]['permalink'] = dict_accOrg[accs]['permalink']
            matches[accs]['final_match'] = ''
            matches[accs]['founded_on'] = dict_accOrg[accs]['founded_on']
            matches[accs]['cohort_year'] = dict_accOrg[accs]['cohort_year']
            matches[accs]['total_funding'] = dict_accOrg[accs]['total_funding']
            matches[accs]['undisclosed_amount'] = ''
            the_acc = dict_accOrg[accs]
            for alls in dict_allOrg:
                if the_acc['founded_on'] == dict_allOrg[alls]['founded_on']:
                    if the_acc['location'].split(', ')[0] == dict_allOrg[alls]['location'].split(', ')[0]:
                        # school then funding
                        schools = dict_allOrg[alls]['schools'].split(', ')
                        for school in schools:
                            if school in the_acc['schools']:
                                fund_count = 0
                                total_fund = 0
                                add_all_funds = True
                                while add_all_funds:
                                    if 'fund ' + str(fund_count) in dict_allOrg[alls] and \
                                            dict_allOrg[alls]['fund ' + str(fund_count)]:
                                        fund_data = dict_allOrg[alls]['fund ' + str(fund_count)].split(':')
                                        if int(the_acc['founded_on']) <= int(fund_data[0]) <= int(
                                                the_acc['cohort_year']):
                                            total_fund += total_fund + int(fund_data[1])
                                            if int(fund_data[1]) == 0:
                                                matches[accs]['undisclosed_amount'] = 'yes'
                                        fund_count += 1
                                    else:
                                        add_all_funds = False
                                diff = abs(int(the_acc['total_funding']) - total_fund)
                                margin = int(the_acc['total_funding']) / 10
                                if diff <= int(margin):
                                    matches[accs]['match' + str(len(matches[accs]) - 6)] = dict_allOrg[alls][
                                        'permalink']
                                    if len(matches[accs]['final_match']) == 0:
                                        matches[accs]['final_match'] = dict_allOrg[alls]['permalink']
                                    break

                if 'undisclosed_amount' not in matches[accs]:
                    matches[accs]['undisclosed_amount'] = 'no'
        count += 1

    # filtering
    # by date, location, school
    for match in matches:
        # print('matching ', match)
        # no matches
        the_acc = dict_accOrg[match]
        if len(matches[match]) == 6:
            for alls in dict_allOrg:
                if the_acc['founded_on'] == dict_allOrg[alls]['founded_on']:
                    if the_acc['location'].split(', ')[0] == dict_allOrg[alls]['location'].split(', ')[0]:
                        schools = dict_allOrg[alls]['schools'].split(', ')
                        for school in schools:
                            if school in the_acc['schools']:
                                matches[match]['match' + str(len(matches[match]) - 6)] = dict_allOrg[alls][
                                    'permalink']
                                if len(matches[match]['final_match']) == 0:
                                    matches[match]['final_match'] = dict_allOrg[alls]['permalink']
                                break

    # by date, location
    for match in matches:
        # print('matching ', match)
        # no matches
        the_acc = dict_accOrg[match]
        if len(matches[match]) == 6:
            for alls in dict_allOrg:
                if the_acc['founded_on'] == dict_allOrg[alls]['founded_on']:
                    if the_acc['location'].split(', ')[0] == dict_allOrg[alls]['location'].split(', ')[0]:
                        matches[match]['match' + str(len(matches[match]) - 6)] = dict_allOrg[alls][
                            'permalink']
                        if len(matches[match]['final_match']) == 0:
                            matches[match]['final_match'] = dict_allOrg[alls]['permalink']

    # by date
    for match in matches:
        # print('matching ', match)
        # no matches
        the_acc = dict_accOrg[match]
        if len(matches[match]) == 6:
            for alls in dict_allOrg:
                if the_acc['founded_on'] == dict_allOrg[alls]['founded_on']:
                    matches[match]['match' + str(len(matches[match]) - 6)] = dict_allOrg[alls][
                        'permalink']
                    if len(matches[match]['final_match']) == 0:
                        matches[match]['final_match'] = dict_allOrg[alls]['permalink']

    # by location
    for match in matches:
        # print('matching ', match)
        # no matches
        the_acc = dict_accOrg[match]
        if len(matches[match]) == 6:
            for alls in dict_allOrg:
                if the_acc['location'].split(', ')[0] == dict_allOrg[alls]['location'].split(', ')[0]:
                    matches[match]['match' + str(len(matches[match]) - 6)] = dict_allOrg[alls][
                        'permalink']
                    if len(matches[match]['final_match']) == 0:
                        matches[match]['final_match'] = dict_allOrg[alls]['permalink']

    # avoid duplicates
    for go in range(2):
        for match in matches:
            print('matching ', match)
            keep_going = True
            match_count = 0
            while keep_going:
                keep_going = False
                for match2 in matches:
                    if match != match2:
                        if matches[match]['final_match'] == matches[match2]['final_match']:
                            # matched, reassign and start over
                            match_count += 1
                            if 'match' + str(match_count) in matches[match]:
                                # next try, start over
                                matches[match]['final_match'] = matches[match]['match' + str(match_count)]
                                keep_going = True
                            else:
                                # no more match_count, give up but re-assign match to match2
                                the_acc = dict_accOrg[match]
                                for alls in dict_allOrg:
                                    if the_acc['founded_on'] == dict_allOrg[alls]['founded_on']:
                                        if the_acc['location'].split(', ')[0] == dict_allOrg[alls]['location'].split(', ')[0]:
                                            matches[match]['match' + str(len(matches[match]) - 6)] = dict_allOrg[alls][
                                                'permalink']
                                            if len(matches[match]['final_match']) == 0:
                                                matches[match]['final_match'] = dict_allOrg[alls]['permalink']
                                keep_going = False
                            break

    with open(output_path, 'w') as csv_file:
        max_element = get_max(matches)
        writer = csv.DictWriter(csv_file, fieldnames=list(max_element.keys()))
        # writer = csv.DictWriter(csv_file, fieldnames=['acc_name', 'matched_name'])
        writer.writeheader()
        for key in matches:
            writer.writerow(matches[key])
            # writer.writerow(matches[key])
    print('done')


def write_file(dict_write, output_path):
    with open(output_path, 'w') as csv_file:
        max_element = get_max(dict_write)
        writer = csv.DictWriter(csv_file, fieldnames=max_element)
        writer.writeheader()
        for key in dict_write:
            writer.writerow(dict_write[key])
    print('done')


# def search_year(start_pos, stop_pos):
#     dict_accOrg = load_csv_to_dict(acc_path)
#     dict_allOrg = load_csv_to_dict(all_path)
#     matches = {}
#     count = 0
#     for accs in dict_accOrg:
#         if start_pos <= count <= stop_pos:
#             print('matching founding year ', count, ' of ', len(dict_accOrg))
#             the_acc = dict_accOrg[accs]
#             matches[the_acc['name']] = {}
#             for alls in dict_allOrg:
#                 if dict_accOrg[accs]['founded_on'] == dict_allOrg[alls]['founded_on']:
#                     # add it to as a match
#                     acc_name = the_acc['permalink']
#
#                     if 'match_count' in matches[dict_accOrg[accs]['name']]:
#                         matches[acc_name]['match_count'] += 1
#                     else:
#                         matches[acc_name]['match_count'] = 1
#                     matches[acc_name]['match' + str(matches[acc_name]['match_count'])] = alls
#         count += 1
#     print('done')
#     return matches
#
#
# def search_location(matches_year):
#     dict_accOrg = load_csv_to_dict(acc_path)
#     dict_allOrg = load_csv_to_dict(all_path)
#     matches = {}
#     count = 0
#     for accs in matches_year:
#         print('matching location ', count, ' of ', len(dict_accOrg))
#         the_acc = dict_accOrg[accs]
#         matches[the_acc['name']] = {}
#         for alls in dict_allOrg:
#             if dict_accOrg[accs]['location'] == dict_allOrg[alls]['location']:
#                 # add it to as a match
#                 acc_name = the_acc['name']
#
#                 if 'match_count' in matches[dict_accOrg[accs]['name']]:
#                     matches[acc_name]['match_count'] += 1
#                 else:
#                     matches[acc_name]['match_count'] = 1
#                 matches[acc_name]['match' + str(matches[acc_name]['match_count'])] = alls
#         count += 1
#     print('done')
#     return matches


search('matched.csv', 0, 2100)

# write_file(matches, output_path)
# matches_with_year = search_year(0, 200)
# matches_with_loc = search_location(matches_with_year)
# scan('allOrgPermalink.csv', 'final_allOrg001.csv', False, 0, 40000  )
# scan('accOrgPermalink.csv', 'final_accOrg001.csv', True, 0, 2100)
