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

            // d3.json(BASE_URL + 'revad_cs3_org_sciencemesh_site_total_num_users').then(function (data) {
            //     const dataset = [];
            //     let totalUsers = 0;
            //     data.data.result.forEach(function (d) {
            //         dataset.push({'value': +d.value[1], 'name': d.metric.site})
            //         totalUsers += +d.value[1];
            //     });
            //     d3.select('#total-users').text(d3.format('.2s')(totalUsers));
            //     renderBarChart('#users-breakdown', dataset);
            // })
            //
            // d3.json(BASE_URL + 'revad_cs3_org_sciencemesh_site_total_amount_storage').then(function (data) {
            //     const dataset = [];
            //     let totalStorage = 0;
            //     data.data.result.forEach(function (d) {
            //         dataset.push({'value': +d.value[1], 'name': d.metric.site})
            //         totalStorage += +d.value[1];
            //     });
            //
            //     d3.select('#total-storage').text(d3.format('.2s')(totalStorage) + 'B');
            //     renderBarChart('#storage-breakdown', dataset);
            // })

            // Render map view

            d3.json('https://iop.sciencemesh.uni-muenster.de/iop/mentix/loc').then(function (data) {
                console.log(data);
                const width = getWidth('#map');
                const height = 500;
                const projection = d3.geoMercator().center([12, 49]).scale(900).translate([width / 2, height / 2]);


                d3.json('/assets/data/world.geojson').then(function (geo) {
                    let svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);
                    let g = svg.append('g').attr('class', 'container');

                    g.append("g")
                        .selectAll("path")
                        .data(geo.features)
                        .enter()
                        .append("path")
                        // draw each country
                        .attr("d", d3.geoPath()
                            .projection(projection)
                        ).style('fill', 'white')
                        .style('stroke', '#ecf0f1')
                        .style('stroke-width', 1);

                    const graphNode = g.selectAll('g.node').data(data).enter().append('g').attr('class', 'node');

                    graphNode.attr('transform', function (d) {
                            if(d.name === "SURFSARA") {
                                d.latitude += .4
                            }
                            const proj = projection([d.longitude, d.latitude]);
                            return `translate(${proj[0]},${proj[1]})`
                        }
                    );

                    var zoom = d3.zoom()
                        .scaleExtent([0.6, 15])
                        .on('zoom', function (event) {
                            g.attr("transform", "translate(" + event.transform.x + "," + event.transform.y + ")" + " scale(" + event.transform.k + ")");
                        });

                    svg.call(zoom);

                    graphNode.append('circle').attr('r', 3).style('fill', '#1F91CC');
                    graphNode.append('text').attr('x', 7).attr('y', 3.5)
                        .style('fill', '#243548')
                        .style('font-size', '10px')
                        .style('font-weight', 'bolder')
                        .attr('text-anchor', 'start').text(function (d) {
                        return d.name;
                    });
                })
            })
        }
    }
})();