using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace intercom.fm.Controllers
{
    public class TopUsersController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage Get()
        {
			var response = new HttpResponseMessage()
			{
				Content = new StringContent(CallTopUsersAPI())
			};

			response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

			return response;
        }

		private string CallTopUsersAPI()
		{
			string url = "http://intercom-app-staging.herokuapp.com/users/popular.json";

			try
			{
				using (HttpClient client = new HttpClient())
				{
					var response = client.GetAsync(url).Result;
					return response.Content.ReadAsStringAsync().Result;
				}
			}
			catch (HttpRequestException)
			{
				return "";
			}
		}
    }
}