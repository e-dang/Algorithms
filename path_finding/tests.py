import pytest
from django.urls import reverse


@pytest.mark.unit
class TestViews:

    def test_path_finding_view_renders_instruction_template(self, client):
        url = reverse('path-finding')

        response = client.get(url)

        assert response.status_code == 200
        assert 'path_finding.html' in (template.name for template in response.templates)
