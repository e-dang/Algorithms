import pytest
from django.http import HttpRequest
from django.urls import reverse
from mock import patch
from .views import path_finding, DEFAULT_GRID_PARAMS


@pytest.mark.unit
class TestViews:

    def test_path_finding_view_renders_instruction_template(self, client):
        url = reverse('path-finding')

        response = client.get(url)

        assert response.status_code == 200
        assert 'path_finding.html' in (template.name for template in response.templates)

    @patch('path_finding.views.render')
    def test_path_finding_view_passes_grid_defaults_to_rendered_template(self, mock_render):

        response = path_finding(HttpRequest())

        assert response is mock_render.return_value
        assert mock_render.call_args.kwargs['context'] == DEFAULT_GRID_PARAMS
