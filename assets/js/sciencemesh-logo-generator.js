var scienceMeshLogo = (function () {
    // Provides functions to generate variations of the ScienceMesh logo.

    var colours = ["#1F91CC", "#454A54", "#bdc3c7", "#FFFFFF"];

    var getColour = function () {
        var seed = Math.random();
        if (seed < 0.05) {
            return colours[0];
        } else if (seed < 0.1) {
            return colours[1];
        } else if (seed < 0.15) {
            return colours[2];
        }
        return colours[3];
    };

    function save_as_svg(id){
        var svg_data = d3.select('#' + id + ' svg').node().innerHTML;
        var head = '<svg title="sciencemesh-logo" version="1.1" xmlns="http://www.w3.org/2000/svg">'

        var full_svg = head + svg_data + "</svg>"
        var blob = new Blob([full_svg], {type: "image/svg+xml"});  
        saveAs(blob, "sciencemesh-" + id+ ".svg");
    };

    var generateLogo = function (id) {

        var container = d3.select('#logo-' + id);
        var svg = container.append('svg');
        var group = Math.floor(Math.random() * 36) + 1;
        var copy = d3.select("#logo-template svg #m" + group);
        var g = svg.append('g').html(copy.html());
        var bbox = g.node().getBBox();

        svg.attr('width', bbox.width +3).attr('height', Math.max(100, bbox.height + 3));

        g.attr('transform', function() {
            var _transformation = 'translate(-' + Math.max(2, bbox.x - 2) + ',-' + Math.max(2, bbox.y - 2) + ')';
            return _transformation;
        });

        container.on('mouseover', function() {
            d3.select(this).select('.btn-download').style('opacity', 1)
        });

        container.on('mouseout', function() {
            d3.select(this).select('.btn-download').style('opacity', 0)
        });

        var btn = container.append('p').style('opacity', 0).attr('class', 'btn-download').attr('data-logo', function(d) {
            return 'logo-' + d;
        });
        btn.text('Download');
        btn.on('click', function(e) {
            var id = d3.select(this).attr('data-logo');
            save_as_svg(id);
        })
        
        

        g.selectAll('path').style('fill', function () {
            return getColour();
        })
    };

    var generateNumbers = function (start, stop) {
        var a = [];
        for (var i = start; i <= stop; i++) {
            a.push(i)
        }
        return a;
    }

    return {


        generate: function (logoCount) {
            d3.xml("assets/svg/logo-template.svg")
                .then(function (data) {
                    console.log(data.documentElement);
                    d3.select('#logo-template').node().append(data.documentElement);

                    d3.selectAll('#logo-template path').style('stroke', '#454A54');

                    const numArray = generateNumbers(0, logoCount);
                    d3.select('#logo-container').selectAll('.generated-logo').data(numArray).enter().append('div').attr('class', 'generated-logo').attr('id', function (d) {
                        return 'logo-' + d;
                    });

                    numArray.forEach(function (d) {
                        generateLogo(d);
                    });

                });
        },

        scrollToElement: function (id) {
            var el = document.getElementById(id)

            var offsetTop = window.pageYOffset || document.documentElement.scrollTop;
            d3.transition()
                .delay(0)
                .duration(400)
                .tween("scroll", (offset => () => {
                    var i = d3.interpolateNumber(offsetTop, offset);
                    return t => scrollTo(0, i(t) - 50)
                })(offsetTop + el.getBoundingClientRect().top));
        }



    }
})();