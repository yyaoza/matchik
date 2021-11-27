import csv
import json
import requests

# permalinkPath_accOrg = 'accOrgPermalink.csv'
permalinkPath_allOrg = 'allOrgPermalink.csv'
linkPath_all6_forWalt = 'all6_forWalt.csv'

dict_accOrgPermalinks = {}
dict_allOrgPermalinks = {}


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
for key in dict_accOrgPermalinks:
    temp_dict_accOrgPermalinks[key] = dict_accOrgPermalinks[key]
    if len(temp_dict_accOrgPermalinks) > 1:
        break

print('grabbing data from Crunchbase...')
for key in temp_dict_accOrgPermalinks:
    URL = ['https://api.crunchbase.com/api/v4/entities/organizations/',
           temp_dict_accOrgPermalinks[key]['permalink'],
           '?card_ids=founders,raised_funding_rounds',
           '&field_ids=founded_on,location_identifiers',
           '&user_key=c4564ba5932862bc86b28ae5e4397cf7']
    URL = ''.join(URL)
    print(URL)
    r = requests.get(url=URL)
    r_json = json.loads(r.text)
    temp_dict_accOrgPermalinks[key]['founded_on'] = r_json['properties']['founded_on']['value']
    temp_dict_accOrgPermalinks[key]['location'] = r_json['properties']['location_identifiers'][0]['value']

with open('final_accOrg.csv', 'w') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=list(temp_dict_accOrgPermalinks.values())[0].keys())
    writer.writeheader()
    for key in temp_dict_accOrgPermalinks:
        writer.writerow(temp_dict_accOrgPermalinks[key])
print('done')


