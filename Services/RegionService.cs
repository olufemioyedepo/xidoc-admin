using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XIDOC.Services
{
    public class RegionService
    {
        private string jsonResponse, endpoint, lgaendpoint, url;
        IConfiguration _configuration;

        public RegionService(IConfiguration configuration)
        {
            _configuration = configuration;
            endpoint = _configuration.GetSection("Endpoints").GetSection("states").Value;
            lgaendpoint = _configuration.GetSection("Endpoints").GetSection("lgas").Value;
        }
    }
}
