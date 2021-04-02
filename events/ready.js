module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log("[READY] "+client.user.tag+" is up and running!")
  }
}
