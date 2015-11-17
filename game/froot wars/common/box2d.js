/**
 * Created by king on 2015/7/15.
 */
var b2Vec2 = Box2D.Common.Math.b2Vec2;

var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;

var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var box2d = {  //  放置所有与Box2d相关的方法
    scale : 30,
    init : function(){
        // 创建Box2D世界，大部分物理运算将在此完成
        var gravity = new b2Vec2(0,9.8);
        var allowSleep = true;
        box2d.world = new b2World(gravity,allowSleep);
         // 设置调试绘图
        var debugContext = document.getElementById('debugCanvas').getContext('2d');
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(debugContext);
        debugDraw.SetDrawScale(box2d.scale);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        box2d.world.SetDebugDraw(debugDraw);

        // 添加碰撞损坏
        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.PostSolve = function(contact,impulse){  // 重写 postSolve
            var body1 = contact.GetFixtureA().GetBody();
            var body2 = contact.GetFixtureB().GetBody();
            var entity1 = body1.GetUserData;
            var entity2 = body2.GetUserData;

            var impulseAlongNormal = Math.abs(impulse.normalImpulses[0]);  // 冲击力
            // 防止监听器调用过于频繁，过滤掉小的冲击
            if(impulseAlongNormal > 5){
               if(entity1.health){  // 生命值减去冲击力
                  entity1.health -= impulseAlongNormal;
               }
               if(entity2.health){  // 生命值减去冲击力
                  entity2.health -= impulseAlongNormal;
               }
            }
        };
        box2d.world.SetContactListener(listener);
    },
    createRectangle : function(entity,definition){
        var bodyDef = new b2BodyDef;
        if(entity.isStatic){  // 如果是静止不动动的物体，比如地面
           bodyDef.type = b2Body.b2_staticBody;
        }else{
           bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.x = entity.x/box2d.scale;
        bodyDef.position.y = entity.y/box2d.scale;
        if(entity.angle){
           bodyDef.angle = Math.PI * entity.angle/180;  // 弧度 = π * 角度 / 180 , 角度 =  弧度 / 180 * π
        } // end angle

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2PolygonShape;
        fixtureDef.shape.SetAsBox(entity.width/2/box2d.scale,entity.height/2/box2d.scale);

        var body = box2d.world.CreateBody(bodyDef);
        body.SetUserData(entity);
        body.CreateFixture(fixtureDef);
        return body;
    },
    createCircle : function(entity,definition){
        var bodyDef = new b2BodyDef;
        if(entity.isStatic){  // 如果是静止不动动的物体，比如地面
            bodyDef.type = b2Body.b2_staticBody;
        }else{
            bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.x = entity.x/box2d.scale;
        bodyDef.position.y = entity.y/box2d.scale;
        if(entity.angle){
            bodyDef.angle = Math.PI * entity.angle/180;  // 弧度 = π * 角度 / 180 , 角度 =  弧度 / 180 * π
        } // end angle

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = definition.density;
        fixtureDef.friction = definition.friction;
        fixtureDef.restitution = definition.restitution;

        fixtureDef.shape = new b2CircleShape(entity.radius/box2d.scale);

        var body = box2d.world.CreateBody(bodyDef);
        body.SetUserData(entity);
        body.CreateFixture(fixtureDef);
        return body;
    },
    step:function(timeStep){
        // 速度迭代数=8
        //位置迭代数=3
        if(timeStep > 2/60){ // 步长超过1/30的话 将其截断 为 1/30
           timeStep = 2/60;
        }
        box2d.world.Step(timeStep,8,3);
    }
};