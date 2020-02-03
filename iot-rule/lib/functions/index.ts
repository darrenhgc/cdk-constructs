// handler | process payload sent to AWS IoT Rules
module.exports.handler = async (event: any): Promise<any> => {
  console.log('Event received:\n%j', event);

  return {
    statuCode: 200,
    body: JSON.stringify({ ok: true })
  }
}
