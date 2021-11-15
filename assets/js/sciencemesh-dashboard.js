var sciencemeshDashboard = (function () {

    const BASE_URL = 'https://prometheus.sciencemesh.uni-muenster.de/api/v1/query?query=';

    function getWidth(container_id) {
        return d3.select(container_id).node().getBoundingClientRect().width
    }

    function renderBarChart(container_id, dataset) {
        const barChart = britecharts.bar();

        barChart
            .margin({
                left: 120,
                right: 50,
                top: 20,
                bottom: 20
            })
            // .percentageAxisToMaxRatio(1.3)
            .isHorizontal(true)
            .isAnimated(true)
            .enableLabels(true)
            .labelsNumberFormat('.3s')
            .numberFormat('s')
            .colorSchema(['#1F91CC'])
            .width(getWidth(container_id))
            .height(250);

        d3.select(container_id).datum(d3.sort(dataset, function (a, b) {
            return d3.ascending(a.value, b.value);
        })).call(barChart);
    }

    return {
        render: function () {

            d3.json(BASE_URL + 'revad_cs3_org_sciencemesh_site_total_num_users').then(function (data) {
                const dataset = [];
                let totalUsers = 0;
                data.data.result.forEach(function (d) {
                    dataset.push({'value': +d.value[1], 'name': d.metric.site})
                    totalUsers += +d.value[1];
                });
                console.log(totalUsers);
                d3.select('#total-users').text(d3.format('.2s')(totalUsers));
                renderBarChart('#users-breakdown', dataset);
            })

            d3.json(BASE_URL + 'revad_cs3_org_sciencemesh_site_total_amount_storage').then(function (data) {
                const dataset = [];
                let totalStorage = 0;
                data.data.result.forEach(function (d) {
                    dataset.push({'value': +d.value[1], 'name': d.metric.site})
                    totalStorage += +d.value[1];
                });

                d3.select('#total-storage').text(d3.format('.2s')(totalStorage) + 'B');
                renderBarChart('#storage-breakdown', dataset);
            })
            // Get info
        }
    }
})();