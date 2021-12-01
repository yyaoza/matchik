import csv
import json
import requests
# from collections import OrderedDict

# permalinkPath_accOrg = 'accOrgPermalink.csv'
# permalinkPath_allOrg = 'allOrgPermalink.csv'
# linkPath_all6_forWalt = 'all6_forWalt.csv'

dict_accOrgPermalinks = {}
dict_allOrgPermalinks = {}

missing_founded_dates = {'300milligrams@500startups': '2012', 'check-my-campus@fbFund': '0000',
                         'gopillar-academy@500startups': '2018', 'cognito-networks@TheAlchemistAccelerator': '2014',
                         'hykso-inc@y combinator': '2013', 'itoi@TheAlchemistAccelerator': '2014',
                         'cognito-networks@TheAlchemistAccelerator': '2014', 'newsbrane@fbFund': '2008',
                         'photos-i-like@fbFund': '0000', 'realgifts@fbFund': '0000',
                         'sendtask@TheAlchemistAccelerator': '2012', 'storytree@500startups': '2011',
                         'speakergram@500startups': '2011', 'tenfoot@UpwestLabs': '2011',
                         'translate-abroad@500startups': '2011'}
missing_locations = {}


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


dict_accOrgPermalinks = load_csv_to_dict('accOrgPermalink.csv')
dict_all6_forWalt = load_csv_to_dict('all6_forWalt.csv')

# used for testing only
temp_dict_accOrgPermalinks = {}

print('grabbing data from Crunchbase...')
for key in dict_accOrgPermalinks:
    URL = ['https://api.crunchbase.com/api/v4/entities/organizations/',
           dict_accOrgPermalinks[key]['permalink'],
           '?card_ids=founders,raised_funding_rounds',
           '&field_ids=founded_on,location_identifiers',
           '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
    URL = ''.join(URL)
    print(URL)
    r = requests.get(url=URL)
    r_json = json.loads(r.text)
    # load from csv
    temp_dict_accOrgPermalinks[key] = dict_accOrgPermalinks[key]
    # before we load from Crunchbase, check if the founders match
    founder_name = ''
    founder_names = ''
    temp_dict_accOrgPermalinks[key]['perfect_match'] = 'no'
    if 'founders' in r_json['cards']:
        for founder in r_json['cards']['founders']:
            # get the schools
            URL = ['https://api.crunchbase.com/api/v4/entities/people/',
                   founder['identifier']['permalink'],
                   '?card_ids=degrees',
                   '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
            URL = ''.join(URL)
            print(URL)
            r_ppl = requests.get(url=URL)
            r_json_founders = json.loads(r_ppl.text)
            school_names = ''
            for degrees in r_json_founders['cards']['degrees']:
                school_name = degrees['school_identifier']['permalink']
                school_names = school_names + school_name + ', '

            temp_dict_accOrgPermalinks[key]['schools'] = school_names[:-2]

            founder_name = founder['identifier']['value']
            founder_names = founder_names + founder_name + ', '
            if temp_dict_accOrgPermalinks[key]['founders'] == founder_name or temp_dict_accOrgPermalinks[key]['founders'].find(founder_name):
                temp_dict_accOrgPermalinks[key]['perfect_match'] = 'yes'
                break

    if temp_dict_accOrgPermalinks[key]['perfect_match'] == 'no' and founder_names:
        temp_dict_accOrgPermalinks[key]['founders'] = founder_names[:-2]

    # + ', '
        # if temp_dict_accOrgPermalinks[key]['founders'] == founder_names[:-2]:
        #     temp_dict_accOrgPermalinks[key]['perfect_match'] = 'yes'
        # else:
        #     temp_dict_accOrgPermalinks[key]['perfect_match'] = 'no'

    # load from Crunchbase
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
        temp_dict_accOrgPermalinks[key]['location'] = r_json['properties']['location_identifiers'][0]['value']

    founded_on = int(temp_dict_accOrgPermalinks[key]['founded_on'])
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

    temp_dict_accOrgPermalinks[key]['total_funding'] = total_funding
    if 'undisclosed_amount' not in temp_dict_accOrgPermalinks[key]:
        temp_dict_accOrgPermalinks[key]['undisclosed_amount'] = 'no'

    # if len(temp_dict_accOrgPermalinks) > 5:
    #     break


with open('final_accOrg.csv', 'w') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=list(temp_dict_accOrgPermalinks.values())[0].keys())
    writer.writeheader()
    for key in temp_dict_accOrgPermalinks:
        writer.writerow(temp_dict_accOrgPermalinks[key])
print('done')


