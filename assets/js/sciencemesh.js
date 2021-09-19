var scienceMesh = (function () {
     
    var svg;
    var colourToType = { "#1F91CC": "applications", "#454A54": "data", "#bdc3c7": "compute", "#FFFFFF": "tile" };
    var colours = Object.keys(colourToType);
    var rtime;
    var timeout = false;
    var delta = 500;
    var currentBg = null;

    var typeToColour = {};
    colours.forEach(function (c) {
        typeToColour[colourToType[c]] = c;
    });

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

    var colourMap = {};

    var mouseOver = function () {
        var tile = d3.select(this);
        tile.style('opacity', 1);
        tile.transition().duration(1000).delay(2000).style('opacity', 0);
    };

    var resizeEnd = function () {
        if (new Date() - rtime < delta) {
            setTimeout(resizeEnd, delta);
        } else {
            timeout = false;
            loadBackground();
        }
    }

    window.addEventListener("resize", function () {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeEnd, delta);
        }
    });

    
    var loadBackground = function () {
        var width = d3.select("#top-background").node().offsetWidth;
        // Check if image that needs to be loaded is different from the current image first.
        // Otherwise we'll let the browser resize the current image.

        var toLoad = "assets/svg/sm-background.svg";

        if (width <= 900) {
            toLoad = "assets/svg/sm-background-medium.svg";
        }

        var reload = true;
        if (!currentBg || currentBg != toLoad) {
            currentBg = toLoad;
        } else {
            reload = false;
        }

        
        if(reload) {
            d3.xml(toLoad)
                .then(function(data) {
                    var container = d3.select("#top-background");
                    container.select('svg').remove();
                    container.node().append(data.documentElement);

                    boundingBox = container.node().getBoundingClientRect();

                    svg = container.select("svg");

                    svg.selectAll(['.st0', '.st1', '.st2', '.st3', '.st4', '.st5', '.st6', '.st7', '.st8']).style('stroke', 'white').style('fill', 'white');
                    svg.selectAll(['.st-text-blue', '.st-text-grey']).style('opacity', 0);

                    var meshes = ['#mesh-1'];
                    var textMeshes = ['#text-mesh-1'];

                    svg.selectAll('.st0').style('fill', '#E6E6E6').style('opacity', 0).on("mouseover", mouseOver);

                    svg.selectAll(meshes).selectAll('polygon, path').each(function (d, i) {
                        var tileId = 'tile-' + i;
                        d3.select(this).attr('id', tileId);

                        var c = getColour();

                        d3.select(this).classed(colourToType[c], true)

                        colourMap[tileId] = c;
                    });

                    // First we iterate by type of tile, data, application, and computation
                    ['data', 'applications', 'compute'].forEach(function (tile_type, i) {

                        svg.select('#mesh-1').selectAll('.' + tile_type)
                            .transition()
                            .delay(i * 1500)
                            .duration(1000)
                            .style('opacity', 1)
                            .style('fill', function (d) {
                                colourMap[d3.select(this).attr('id')] = typeToColour[tile_type];
                                return typeToColour[tile_type];
                            })

                        d3.select('#' + tile_type + '-text').transition().delay(i * 1500).duration(1000).style('opacity', 1);
                    })

                    // Then we display each mesh
                    meshes.forEach(function (d, i) {
                        svg.select(d).selectAll('polygon, path')
                            .transition()
                            .delay(4500 + (i * 1000))
                            .duration(1000)
                            .style('opacity', 1)
                            .style('stroke', '#454A54')
                            .style('fill', function () {
                                return colourMap[d3.select(this).attr('id')];
                            });

                        svg.selectAll(textMeshes[i] + ' path')
                            .transition()
                            .delay(4500 + (i * 1000))
                            .duration(1000)
                            .style('opacity', 1);
                    })

                    d3.select('#within-domain-text').transition().delay(4500).duration(1000).style('opacity', 1);


                });
        }
    }

    return {
        initialise: function () {

            loadBackground();
            d3.xml("assets/svg/icons/editing.svg")
                .then(function(data) {
                    var container = d3.select("#editing-image");
                    container.node().append(data.documentElement);
                });

            d3.xml("assets/svg/icons/remote-analysis.svg")
                .then(function(data) {
                    var container = d3.select("#remote-analysis-image");
                    container.node().append(data.documentElement);
                });


            d3.xml("assets/svg/icons/share-between-services.svg")
                .then(function(data) {
                    var container = d3.select("#share-between-services-image");
                    container.node().append(data.documentElement);
                });

            d3.xml("assets/svg/icons/share-icon.svg")
                .then(function(data){
                    var container = d3.select("#transfer-image");
                    container.node().append(data.documentElement);
                });

             d3.xml("assets/svg/stakeholders/researcher.svg")
                .then(function(data) {
                    var container = d3.select("#researcher-image");
                    container.node().append(data.documentElement);
                });

             d3.xml("assets/svg/stakeholders/researcher.svg")
                .then(function(data) {
                    var container = d3.select("#developer-image");
                    container.node().append(data.documentElement);
                });

            d3.xml("assets/svg/stakeholders/sys-admin.svg")
                .then(function(data) {
                    var container = d3.select("#sysadmin-image");
                    container.node().append(data.documentElement);
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
                return t => scrollTo(0, i(t)-80)
              })(offsetTop + el.getBoundingClientRect().top));
          }
    }
})();