# Anand's BBC demo tests - data readme

## weather_full_search.csv
- Used for testing the weather search with complete terms
- File format: CSV, delimited by comma
- Data reference: 
    - **term:** term to be searched in search bar. Single quote then double quote outside that for correct test processing.
    - **list_entry:** entry to be picked from autocompleted search results
    - **heading:** heading value to be asserted on location weather page
    - **obs_station:** observation station to be asserted on location weather page

## weather_partial_search.json
- Used for testing the weather search with partial terms
- File format: JSON, unnamed array of test items
- Data reference:
    - **term:** term to be searched in search bar. Single quote then double quote outside that for correct test processing.
    - **list_entry:** entry to be picked from autocompleted search results
    - **heading:** heading value to be asserted on location weather page
    - **obs_station:** observation station to be asserted on location weather page