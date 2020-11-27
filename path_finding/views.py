from django.shortcuts import render

DEFAULT_GRID_PARAMS = {
    'num_rows': 50,
    'num_cols': 50,
    'start_row': 9,
    'start_col': 9,
    'end_row': 40,
    'end_col': 40
}


def path_finding(request):
    return render(request, 'path_finding.html', context=DEFAULT_GRID_PARAMS)
