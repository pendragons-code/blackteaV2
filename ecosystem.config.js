module.exports = {
	apps: [
		{
			name: "gameRoomSystem",
			script: "./loaders/webserver.js",
			env_production: {
				NODE_ENV: "production"
			},
			env: {
				NODE_ENV: "development"
			},
			ignore_watch: ["node_modules", "Logs"],
			max_memory_restart: "1G",
			out_file: "./Logs/logfile",
			error_file: "./Logs/errorfile"
		}
	]
}